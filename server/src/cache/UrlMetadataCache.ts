import { InMemoryRequestCache } from '.';
import { GetUrlMetadataRequest, GetUrlMetadataResponse } from '../controllers';


export class UrlMetadataCache extends InMemoryRequestCache<GetUrlMetadataRequest, GetUrlMetadataResponse> {

   public computeKey(request: GetUrlMetadataRequest): string {
      return request.url;
   }
}