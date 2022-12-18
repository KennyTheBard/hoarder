import { Collection, Db, ObjectId } from 'mongodb';
import { Id, Tag, WithId } from 'common';

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

   public async getTagById(id: string): Promise<WithId<Tag>> {
      const tagEntity = await this.collection.findOne({ _id: new ObjectId(id) });
      return {
         ...tagEntity,
         _id: tagEntity._id.toString()
      };
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

   public async deleteTags(ids: Id[]): Promise<void> {
      console.log(ids)
      const result = await this.collection.deleteMany({ _id: { $in: ids.map(id => new ObjectId(id)) } });
      if (!result.acknowledged || result.deletedCount === 0) {
         throw new Error('Failed to delete tags');
      }
      console.log(result.deletedCount)
      console.log(await this.collection.find({ _id: { $in: ids.map(id => new ObjectId(id)) } }))
   }

}