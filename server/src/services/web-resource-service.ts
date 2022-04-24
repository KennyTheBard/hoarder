import { Collection, Db } from 'mongodb';
import { WebResource } from '../models';


export class WebResourceService {

   private readonly collection: Collection<WebResource>;

   constructor(
      private readonly db: Db,
      collectionName: string
   ) {
      this.collection = this.db.collection<WebResource>(collectionName);
   }

   public async createResource(resource: WebResource) {
      await this.collection.insertOne(resource);
   }

   public async retrieveResources(): Promise<WebResource[]> {
      return await this.collection.find().toArray();
   }

}