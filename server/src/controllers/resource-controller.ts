import { WebResourceService, TextResourceService } from '../services';


export class ResourceController {

   constructor(
      private readonly webResourceService: WebResourceService,
      private readonly textResourceService: TextResourceService
   ) {}

   public async createResource(req: Request, res: Response) {
      
   }

}