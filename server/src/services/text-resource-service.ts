import { Collection, Db } from 'mongodb';
import { TextResource } from '../models';


export class TextResourceService {

   private readonly collection: Collection<TextResource>;

   constructor(
      private readonly db: Db,
      collectionName: string
   ) {
      this.collection = this.db.collection<TextResource>(collectionName);
   }

   public async createResource(resource: TextResource) {
      await this.collection.insertOne(resource);
   }

   public async retrieveResources(): Promise<TextResource[]> {
      return await this.collection.find().toArray();
   }

}