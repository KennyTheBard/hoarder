import { Collection, Db } from 'mongodb';
import { Bookmark } from '../models';


export class BookmarkService {

   private readonly collection: Collection<Bookmark>;

   constructor(
      private readonly db: Db
   ) {
      this.collection = this.db.collection<Bookmark>('bookmarks');
   }

   public async addBookmark(resource: Bookmark) {
      await this.collection.insertOne(resource);
   }

   public async getAllBookmarks(): Promise<Bookmark[]> {
      return await this.collection.find().toArray();
   }

}