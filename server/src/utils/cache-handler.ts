export interface CacheHandler<RequestType, ResponseType> {
   store: (request: RequestType, response: ResponseType) => void,
   get: (request: RequestType) => ResponseType | undefined,
   isCacheable: (request: RequestType, response: ResponseType) => boolean,
};

export function defaultCacheHandler<RequestType, ResponseType>(): CacheHandler<RequestType, ResponseType> {
   return {
      store: (_request: RequestType, _response: ResponseType) => { },
      get: (_request: RequestType) => undefined,
      isCacheable: (_request: RequestType, _response: ResponseType) => false
   }
};
