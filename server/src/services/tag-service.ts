import { Collection, Db, ObjectId } from 'mongodb';
import { Tag } from '../models';
import { WithId } from '../utils';

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

   public async getAllTags(): Promise<WithId<Tag>[]> {
      return (await this.collection.find().toArray())
         .map(entry => ({
            ...entry,
            _id: entry._id.toString()
         }));
   }

   public async getTagById(id: string): Promise<Tag> {
      return await this.collection.findOne({ _id: new ObjectId(id) });
   }

   public async updateTag(id: string, tag: Tag): Promise<void> {
      const result = await this.collection.updateOne(
         { _id: new ObjectId(id) },
         { $set: { ...tag } },
      );
      if (!result.acknowledged) {
         throw new Error(`Could not update tag with id '${id}'`);
      }
      if (result.matchedCount === 0) {
         throw new Error(`There is no tag with id '${id}'`);
      }
   }

   public async deleteTag(id: string): Promise<void> {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      if (!result.acknowledged || result.deletedCount === 0) {
         throw new Error('Failed to delete tag');
      }
   }

}