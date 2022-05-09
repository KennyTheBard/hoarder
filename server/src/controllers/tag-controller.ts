import { Tag } from '../models';
import { TagService } from '../services';

export class TagController {

   constructor(
      private readonly tagService: TagService,
   ) {}

   public getTags = async (): Promise<GetTagsResponse> => {
      const tags = await this.tagService.getAllTags();
      return {
         count: tags.length,
         tags: tags
      }
   }

   public addTag = async (request: AddTagRequest): Promise<AddTagResponse> => {
      const savedId = await this.tagService.addTag(request);
      return {
         id: savedId
      };
   }

   public deleteTag = async (request: DeleteTagRequest): Promise<void> => {
      await this.tagService.deleteTag(request.id);
   }  
}

export type GetTagsResponse = {
   count: number;
   tags: Tag[];
}

export type AddTagRequest = Tag;

export type AddTagResponse = {
   id: string;
};

export type DeleteTagRequest = {
   id: string;
}