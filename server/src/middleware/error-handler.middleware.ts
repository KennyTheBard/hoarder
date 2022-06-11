import { Request, Response } from 'express';

export class ErrorHandlerMiddleware {
   use = async (error: Error, req: Request, res: Response, next: (err?: any) => void) => {
      console.error(error);
      res.json({ message: error.message });
   }
}

