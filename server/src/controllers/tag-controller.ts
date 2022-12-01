import { Tag, WithId } from 'common';
import { BookmarkService, TagService } from '../services';

export class TagController {

   constructor(
      private readonly tagService: TagService,
      private readonly bookmarkService: BookmarkService,
   ) {}

   public getAllTags = async (): Promise<GetTagsResponse> => {
      const tags = await this.tagService.getAllTags();
      return {
         count: tags.length,
         tags: tags
      }
   }

   public addTag = async (request: AddTagRequest): Promise<AddTagResponse> => {
      const savedId = await this.tagService.addTag(request);
      return {
         tag: await this.tagService.getTagById(savedId)
      };
   }

   public updateTag = async (request: UpdateTagRequest): Promise<void> => {
      await this.tagService.updateTag(request.id, request.tag);
   }

   public deleteTag = async (request: DeleteTagRequest): Promise<void> => {
      await this.tagService.deleteTag(request.id);
      await this.bookmarkService.removeTagFromAllBookmarks(request.id);
   }  
}

export type GetTagsResponse = {
   count: number;
   tags: WithId<Tag>[];
}

export type AddTagRequest = Tag;

export type AddTagResponse = {
   tag: WithId<Tag>
};

export type UpdateTagRequest = {
   id: string;
   tag: Tag;
};

export type DeleteTagRequest = {
   id: string;
}