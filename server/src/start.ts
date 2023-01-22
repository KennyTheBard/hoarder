import { GetMessagesRequest } from './controllers/message-controller';
import { GetTagsExtendedResponse } from './controllers/tag-controller';
import { MovieDb } from 'moviedb-promise';
import { TypeFinderService } from './services/type-finder-service';
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { ErrorHandlerMiddleware } from './middleware';
import { BookmarkService, GameCandidatesService, MetadataService, MediaCandidatesService, TagService, OpenLibraryService, BoardGameCandidatesService, MessageService, TelegramListener, DataService } from './services';
import { AddBookmarkRequest, AddBookmarkResponse, AddTagRequest, AddTagResponse, BookmarkController, DeleteBookmarkRequest, GetAllTagsResponse, GetBookmarksRequest, GetBookmarksResponse, GetUrlMetadataRequest, GetUrlMetadataResponse, MetadataController, TagController, UpdateBookmarkRequest, DeleteTagsRequest, UpdateTagRequest, GetGameDurationCandidatesRequest, GetGameDurationCandidatesResponse, GetTypeSuggestionsResponse, GetTypeSuggestionsRequest, GetMetadataCandidatesRequest, GetMetadataCandidatesResponse, GetVideoDurationInSecondsRequest, GetVideoDurationInSecondsResponse, UpdateIsArchivedForBookmarkRequest, ValidationController, IsUrlAlreadyBookmarkedRequest, IsUrlAlreadyBookmarkedResponse, MessageController, MarkMessagesRequest, GetMessagesResponse, DataController, ExportDataResponse, ImportDataRequest } from './controllers';
import { TableNames, postHandler } from './utils';
import { SteamAppCache, UrlMetadataCache, CandidateMetadataCache, UrlBookedCache } from './cache';
import { RefreshSteamAppCacheCron } from './cron';
import { Client as OmdbClient } from 'imdb-api';
import SteamAPI from 'steamapi';
import { HowLongToBeatService } from 'howlongtobeat';
import { r } from 'rethinkdb-ts';

(async () => {
   try {
      // load environment vars
      dotenv.config();

      // establish connection to database
      const conn = await r.connect({
         password: process.env.RETHINKDB_PASSWORD,
         port: parseInt(process.env.RETHINKDB_PORT),
      });
      conn.use(process.env.RETHINKDB_DATABASE);

      // make sure that our tables exists
      const existingTables = await r.tableList().run(conn);
      for (const table of Object.values(TableNames)) {
         if (!existingTables.includes(table)) {
            await r.tableCreate(table).run(conn);
         }
      }

      // init APIs
      const movieDbClient = new MovieDb(process.env.MOVIEDB_API_KEY);
      const omdbClient = new OmdbClient({ apiKey: process.env.OMDB_API_KEY });
      const steamClient = new SteamAPI('fakekeysoitwontshowwarnings');
      const hltbService = new HowLongToBeatService();

      // init caches
      const steamAppCache = new SteamAppCache();

      // init services
      const openLibraryService = new OpenLibraryService();
      const metadataService = new MetadataService();
      const bookmarkService = new BookmarkService(conn);
      const tagService = new TagService(conn);
      const messageService = new MessageService(conn);
      const gameCandidatesService = new GameCandidatesService(conn, steamClient, steamAppCache, hltbService);
      const mediaCandidatesService = new MediaCandidatesService(movieDbClient, omdbClient);
      const typeFinderService = new TypeFinderService(bookmarkService);
      const boardGameCandidatesService = new BoardGameCandidatesService();
      const dataService = new DataService(conn);
      
      // init telegram listener
      new TelegramListener(process.env.TELEGRAM_BOT, messageService);

      // init crons
      RefreshSteamAppCacheCron.createAndInit(
         60 * 60 * 1000,
         gameCandidatesService,
         steamAppCache
      );

      // init controllers
      const bookmarkController = new BookmarkController(bookmarkService);
      const metadataController = new MetadataController(
         typeFinderService,
         metadataService,
         gameCandidatesService,
         mediaCandidatesService,
         openLibraryService,
         boardGameCandidatesService
      );
      const tagController = new TagController(tagService, bookmarkService);
      const validationController = new ValidationController(bookmarkService);
      const messageController = new MessageController(messageService);
      const dataController = new DataController(dataService);

      // init app with an websocket server
      const app = express();

      // add middleware
      app.use(cors());
      app.use(express.json({
         limit: '10mb'
      }));
      app.use(new ErrorHandlerMiddleware().use);

      // add endpoints
      app.post('/api/addBookmark', postHandler<AddBookmarkRequest, AddBookmarkResponse>(
         bookmarkController.addBookmark
      ));
      app.post('/api/getBookmarks', postHandler<GetBookmarksRequest, GetBookmarksResponse>(
         bookmarkController.getBookmarks
      ));
      app.post('/api/updateBookmark', postHandler<UpdateBookmarkRequest, void>(
         bookmarkController.updateBookmark
      ));
      app.post('/api/deleteBookmark', postHandler<DeleteBookmarkRequest, void>(
         bookmarkController.deleteBookmark
      ));
      app.post('/api/updateIsArchivedForBookmark', postHandler<UpdateIsArchivedForBookmarkRequest, void>(
         bookmarkController.updateIsArchivedForBookmark
      ));
      app.post('/api/getUrlMetadata', postHandler<GetUrlMetadataRequest, GetUrlMetadataResponse>(
         metadataController.getUrlMetadata,
         new UrlMetadataCache()
      ));
      app.post('/api/getGameDurationCandidates', postHandler<GetGameDurationCandidatesRequest, GetGameDurationCandidatesResponse>(
         metadataController.getGameDurationCandidates
      ));
      app.post('/api/getMetadataCandidates', postHandler<GetMetadataCandidatesRequest, GetMetadataCandidatesResponse>(
         metadataController.getMetadataCandidates,
         new CandidateMetadataCache()
      ));
      app.post('/api/getVideoDurationInSeconds', postHandler<GetVideoDurationInSecondsRequest, GetVideoDurationInSecondsResponse>(
         metadataController.getVideoDurationInSeconds
      ));
      app.post('/api/getTypeSuggestions', postHandler<GetTypeSuggestionsRequest, GetTypeSuggestionsResponse>(
         metadataController.getTypeSuggestions
      ));
      app.post('/api/addTag', postHandler<AddTagRequest, AddTagResponse>(
         tagController.addTag
      ));
      app.post('/api/getAllTags', postHandler<void, GetAllTagsResponse>(
         tagController.getAllTags
      ));
      app.post('/api/getTagsExtended', postHandler<void, GetTagsExtendedResponse>(
         tagController.getTagsExtended
      ));
      app.post('/api/updateTag', postHandler<UpdateTagRequest, void>(
         tagController.updateTag
      ));
      app.post('/api/deleteTags', postHandler<DeleteTagsRequest, void>(
         tagController.deleteTags
      ));
      app.post('/api/isUrlAlreadyBookmarked',
         postHandler<IsUrlAlreadyBookmarkedRequest, IsUrlAlreadyBookmarkedResponse>(
            validationController.isUrlAlreadyBookmarked,
            new UrlBookedCache()
         )
      )
      app.post('/api/getMessages', postHandler<GetMessagesRequest, GetMessagesResponse>(
         messageController.getMessages
      ));
      app.post('/api/markMessages', postHandler<MarkMessagesRequest, void>(
         messageController.markMessages
      ));
      app.post('/api/exportData', postHandler<void, ExportDataResponse>(
         dataController.exportData
      ));
      app.post('/api/importData', postHandler<ImportDataRequest, void>(
         dataController.importData
      ));

      // start server
      const port = process.env.PORT;
      app.listen(port, () => {
         console.log(`App listening on the port ${port}`);
      });

   } catch (err) {
      console.error(err);
   }
})();

