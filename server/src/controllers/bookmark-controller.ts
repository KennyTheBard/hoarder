import { BookmarkService } from '../services';


export class BookmarkController {

   constructor(
      private readonly bookmarkService: BookmarkService
   ) {}

   public async addBookmark(req: Request, res: Response) {
      
   }

}