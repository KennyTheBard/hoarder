import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { ErrorHandlerMiddleware } from './middleware';
import { MongoClient } from 'mongodb';
import { BookmarkService, MetadataService, TagService } from './services';
import { AddBookmarkRequest, AddBookmarkResponse, AddTagRequest, AddTagResponse, BookmarkController, DeleteBookmarkRequest, GetTagsResponse, GetBookmarksRequest, GetBookmarksResponse, GetUrlMetadataRequest, GetUrlMetadataResponse, MetadataController, TagController, UpdateBookmarkRequest, DeleteTagRequest, UpdateTagRequest } from './controllers';
import { postHandler } from './utils';

(async () => {
   try {
      // load environment vars
      dotenv.config();

      // establish connections
      const mongoClient = new MongoClient(process.env.MONGO_URL);
      await mongoClient.connect();
      const db = mongoClient.db(process.env.MONGO_DATABASE_NAME)

      // init services
      const bookmarkService = new BookmarkService(db);
      const metadataService = new MetadataService();
      const tagService = new TagService(db);

      // init controllers
      const bookmarkController = new BookmarkController(bookmarkService);
      const metadataController = new MetadataController(metadataService);
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
      app.post('/api/getUrlMetadata', postHandler<GetUrlMetadataRequest, GetUrlMetadataResponse>(
         metadataController.getUrlMetadata
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

