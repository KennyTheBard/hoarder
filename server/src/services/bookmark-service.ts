import { Collection, Db, ObjectId } from 'mongodb';
import { Bookmark } from '../models';


export class BookmarkService {

   private readonly collection: Collection<Bookmark>;

   constructor(
      private readonly db: Db
   ) {
      this.collection = this.db.collection<Bookmark>('bookmarks');
   }

   public async addBookmark(bookmark: Bookmark): Promise<string> {
      const result = await this.collection.insertOne(bookmark);
      if (!result.acknowledged) {
         throw new Error('Bookmark could not be saved');
      }
      return result.insertedId.toString();
   }

   public async getAllBookmarks(): Promise<Bookmark[]> {
      return await this.collection.find().toArray();
   }

   public async updateBookmark(id: string, bookmark: Partial<Bookmark>): Promise<void> {
      const result = await this.collection.updateOne(
         { _id: new ObjectId(id) },
         { $set: { ...bookmark } },
         { upsert: true }
      );
      if (!result.acknowledged) {
         throw new Error(`Could not update bookmark with id '${id}'`);
      }
      if (result.matchedCount === 0) {
         throw new Error(`There is no bookmark with id '${id}'`);
      }
   }

   public async deleteBookmark(id: string): Promise<void> {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      if (!result.acknowledged || result.deletedCount === 0) {
         throw new Error(`Could not delete bookmark with id '${id}'`);
      }
   }

}