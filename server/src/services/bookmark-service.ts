import { Collection, Db } from 'mongodb';
import { Bookmark } from '../models';


export class BookmarkService {

   private readonly collection: Collection<Bookmark>;

   constructor(
      private readonly db: Db
   ) {
      this.collection = this.db.collection<Bookmark>('bookmarks');
   }

   public async addBookmark(bookmark: Bookmark): Promise<string | null> {
      const result = await this.collection.insertOne(bookmark);
      return result.acknowledged ? result.insertedId.toString() : null;
   }

   public async getAllBookmarks(): Promise<Bookmark[]> {
      return await this.collection.find().toArray();
   }

}