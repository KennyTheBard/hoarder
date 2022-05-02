import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { ErrorHandlerMiddleware } from './middleware';
import { MongoClient } from 'mongodb';
import { BookmarkService } from './services';
import { AddBookmarkRequest, AddBookmarkResponse, BookmarkController, DeleteBookmarkRequest, GetBookmarksRequest, GetBookmarksResponse, UpdateBookmarkRequest } from './controllers';
import { postHandler } from './utils/endpoint-handlers';

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

      // init controllers
      const bookmarkController = new BookmarkController(bookmarkService);

      // init app with an websocket server
      const app = express();

      // add middleware
      app.use(cors());
      app.use(express.json());
      app.use(new ErrorHandlerMiddleware().use);


      // add endpoints
      app.post('/api/bookmark/addBookmark', postHandler<AddBookmarkRequest, AddBookmarkResponse>(
         bookmarkController.addBookmark
      ));
      app.post('/api/bookmark/getBookmarks', postHandler<GetBookmarksRequest, GetBookmarksResponse>(
         bookmarkController.getBookmarks
      ));
      app.post('/api/bookmark/updateBookmark', postHandler<UpdateBookmarkRequest, void>(
         bookmarkController.updateBookmark
      ));
      app.post('/api/bookmark/deleteBookmark', postHandler<DeleteBookmarkRequest, void>(
         bookmarkController.deleteBookmark
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

