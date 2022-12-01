import { Metadata } from 'common';
import { InMemoryCache } from '.';


export class UrlMetadataCache extends InMemoryCache<Metadata> {

   public computeKey(entity: Metadata): string {
      return entity.url;
   }
}