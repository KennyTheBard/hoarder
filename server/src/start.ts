import { MovieDb } from 'moviedb-promise';
import { TypeFinderService } from './services/type-finder-service';
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { ErrorHandlerMiddleware } from './middleware';
import { MongoClient } from 'mongodb';
import { BookmarkService, GameMetadataService, MetadataService, MediaMetadataService, TagService } from './services';
import { AddBookmarkRequest, AddBookmarkResponse, AddTagRequest, AddTagResponse, BookmarkController, DeleteBookmarkRequest, GetTagsResponse, GetBookmarksRequest, GetBookmarksResponse, GetUrlMetadataRequest, GetUrlMetadataResponse, MetadataController, TagController, UpdateBookmarkRequest, DeleteTagRequest, UpdateTagRequest, GetGameDurationCandidatesRequest, GetGameDurationCandidatesResponse, GetTypeSuggestionsResponse, GetTypeSuggestionsRequest, GetMetadataCandidatesRequest, GetMetadataCandidatesResponse, GetVideoDurationInSecondsRequest, GetVideoDurationInSecondsResponse, UpdateIsArchivedForBookmarkRequest } from './controllers';
import { postHandler } from './utils';
import { SteamAppCache } from './cache';
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
      // const malAccount = await Mal.auth(process.env.MY_ANIME_LIST_APP_ID).Unstable.login(
      //    process.env.MY_ANIME_LIST_USERNAME,
      //    process.env.MY_ANIME_LIST_PASSWORD
      // );

      // init caches
      const steamAppCache = new SteamAppCache();

      // init services
      const bookmarkService = new BookmarkService(db);
      const metadataService = new MetadataService();
      const gameMetadataService = new GameMetadataService(db, steamClient, steamAppCache, hltbService);
      const tagService = new TagService(db);
      const typeFinderService = new TypeFinderService(bookmarkService);
      const mediaMetadataService = new MediaMetadataService(movieDbClient, omdbClient);

      // init crons
      RefreshSteamAppCacheCron.createAndInit(
         60 * 60 * 1000,
         gameMetadataService,
         steamAppCache
      );

      // init controllers
      const bookmarkController = new BookmarkController(bookmarkService);
      const metadataController = new MetadataController(typeFinderService, metadataService, gameMetadataService, mediaMetadataService);
      const tagController = new TagController(tagService);

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
         metadataController.getUrlMetadata
      ));
      app.post('/api/getGameDurationCandidates', postHandler<GetGameDurationCandidatesRequest, GetGameDurationCandidatesResponse>(
         metadataController.getGameDurationCandidates
      ));
      app.post('/api/getMetadataCandidates', postHandler<GetMetadataCandidatesRequest, GetMetadataCandidatesResponse>(
         metadataController.getMetadataCandidates
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
         tagController.getTags
      ));
      app.post('/api/updateTag', postHandler<UpdateTagRequest, void>(
         tagController.updateTag
      ));
      app.post('/api/deleteTag', postHandler<DeleteTagRequest, void>(
         tagController.deleteTag
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

