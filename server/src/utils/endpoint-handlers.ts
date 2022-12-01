import { Request, Response } from 'express';
import { CacheHandler, defaultCacheHandler } from '.';
import { InMemoryRequestCache } from '../cache';


export function postHandler<RequestType, ResponseType>(
   handler: (request: RequestType) => Promise<ResponseType>,
   cache: CacheHandler<RequestType, ResponseType> = defaultCacheHandler<RequestType, ResponseType>()
) {
   return async (req: Request, res: Response) => {
      const cachedResponse = cache.get(req.body);
      if (cachedResponse) {
         return cachedResponse;
      }

      try {
         const result = await handler(req.body);
         if (cache.isCacheable(req.body, result)) {
            cache.store(req.body, result);
         }

         res.status(200).json({
            success: true,
            ...result
         })
      } catch (error) {
         res.status(500).json({
            success: false,
            error: error.message
         })
      }
   };

}
