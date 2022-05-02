import { Request, Response } from 'express';


export function postHandler<T, U>(
   handler: (request: T) => Promise<U>
) {
   return async (req: Request, res: Response) => {
      try {
         const result = await handler(req.body);
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
