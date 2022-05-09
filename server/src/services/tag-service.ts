import { Collection, Db, ObjectId } from 'mongodb';
import { Tag } from '../models';

export class TagService {

   private readonly collection: Collection<Tag>;

   constructor(
      private readonly db: Db
   ) {
      this.collection = this.db.collection<Tag>('tags');
   }

   public async addTag(tag: Tag): Promise<string> {
      const extistingTag = await this.collection.findOne({
         name: tag.name
      });

      if (extistingTag) {
         throw new Error('Tag already exists');
      }

      const result = await this.collection.insertOne(tag);
      if (!result.acknowledged) {
         throw new Error('Tag could not be saved');
      }
      return result.insertedId.toString();
   }

   public async getAllTags(): Promise<Tag[]> {
      return await this.collection.find().toArray();
   }

   public async deleteTag(id: string): Promise<void> {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      if (!result.acknowledged || result.deletedCount === 0) {
         throw new Error('Failed to delete tag');
      }
   }

}