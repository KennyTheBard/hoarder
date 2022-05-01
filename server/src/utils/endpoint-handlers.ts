import { Request, Response } from 'express';


export function postHandler<T, U>(
   handler: (request: T) => Promise<U>
) {
   return async (req: Request, res: Response) => res.status(200).json(await handler(req.body));
}
