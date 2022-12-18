import { MovieDb } from 'moviedb-promise';
import { TypeFinderService } from './services/type-finder-service';
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { ErrorHandlerMiddleware } from './middleware';
import { MongoClient } from 'mongodb';
import { BookmarkService, GameCandidatesService, MetadataService, MediaCandidatesService, TagService, OpenLibraryService, BoardGameCandidatesService } from './services';
import { AddBookmarkRequest, AddBookmarkResponse, AddTagRequest, AddTagResponse, BookmarkController, DeleteBookmarkRequest, GetTagsResponse, GetBookmarksRequest, GetBookmarksResponse, GetUrlMetadataRequest, GetUrlMetadataResponse, MetadataController, TagController, UpdateBookmarkRequest, DeleteTagsRequest, UpdateTagRequest, GetGameDurationCandidatesRequest, GetGameDurationCandidatesResponse, GetTypeSuggestionsResponse, GetTypeSuggestionsRequest, GetMetadataCandidatesRequest, GetMetadataCandidatesResponse, GetVideoDurationInSecondsRequest, GetVideoDurationInSecondsResponse, UpdateIsArchivedForBookmarkRequest, ValidationController, IsUrlAlreadyBookmarkedRequest, IsUrlAlreadyBookmarkedResponse } from './controllers';
import { postHandler } from './utils';
import { SteamAppCache, UrlMetadataCache, CandidateMetadataCache, UrlBookedCache } from './cache';
import { RefreshSteamAppCacheCron } from './cron';
import { Client as OmdbClient } from 'imdb-api';
import SteamAPI from 'steamapi';
import { HowLongToBeatService } from 'howlongtobeat';

(async () => {
   try {
      // load environment vars
      dotenv.config();

      // establish connections
      const mongoClient = new MongoClient(process.env.MONGO_URL);
      await mongoClient.connect();
      const db = mongoClient.db(process.env.MONGO_DATABASE_NAME)

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
      const bookmarkService = new BookmarkService(db);
      const tagService = new TagService(db);
      const gameCandidatesService = new GameCandidatesService(db, steamClient, steamAppCache, hltbService);
      const mediaCandidatesService = new MediaCandidatesService(movieDbClient, omdbClient);
      const typeFinderService = new TypeFinderService(bookmarkService);
      const boardGameCandidatesService = new BoardGameCandidatesService();

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

      // init app with an websocket server
      const app = express();

      // add middleware
      app.use(cors());
      app.use(express.json());
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
      app.post('/api/getTags', postHandler<void, GetTagsResponse>(
         tagController.getAllTags
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

      // start server
      const port = process.env.PORT;
      app.listen(port, () => {
         console.log(`App listening on the port ${port}`);
      });

   } catch (err) {
      console.error(err);
   }
})();

