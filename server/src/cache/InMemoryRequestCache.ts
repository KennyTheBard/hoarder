import { InMemoryCache } from '.';


export abstract class InMemoryRequestCache<RequestType, ResponseType> {
   protected readonly cache: InMemoryCache<ResponseType>;

   constructor () {
      this.cache = new InMemoryCache<ResponseType>();
   }

   public store(request: RequestType, response: ResponseType): void {
      this.cache.store(this.computeKey(request), response);
   }

   public get(request: RequestType): ResponseType | undefined {
      return this.cache.get(this.computeKey(request));
   }

   public abstract computeKey(request: RequestType): string;

   public isCacheable(_request: RequestType, _response: ResponseType): boolean {
      return true;
   };

}