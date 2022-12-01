import { InMemoryRequestCache } from '.';
import { IsUrlAlreadyBookmarkedRequest, IsUrlAlreadyBookmarkedResponse } from '../controllers';


export class UrlBookedCache extends InMemoryRequestCache<IsUrlAlreadyBookmarkedRequest, IsUrlAlreadyBookmarkedResponse> {

   public computeKey(request: IsUrlAlreadyBookmarkedRequest): string {
      return request.url;
   }

   public isCacheable(_request: IsUrlAlreadyBookmarkedRequest, response: IsUrlAlreadyBookmarkedResponse): boolean {
      return response.alreadyBookmarked;
   }
}