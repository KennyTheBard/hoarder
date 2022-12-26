import { Id, Message, MessageStatus, Pagination, WithId, WithPagination, WithTotal } from 'common';
import { MessageService } from '../services';


export class MessageController {

   constructor(
      private readonly messageService: MessageService,
   ) {}

   public getMessages = async (request: GetMessagesRequest): Promise<GetMessagesResponse> => {
      const result = await this.messageService.getPendingMessages(request.pagination || {
         limit: 1000
      });

      return {
         ...result,
         pagination: request.pagination,
      };
   }

   public markMessagesAsIgnored = async (request: MarkMessagesRequest): Promise<void> => {
      await this.messageService.setMessagesStatus(request.ids, MessageStatus.IGNORED);
   }

   public markMessagesAsBookmarked = async (request: MarkMessagesRequest): Promise<void> => {
      await this.messageService.setMessagesStatus(request.ids, MessageStatus.BOOKMARKED);
   }

}

export type GetMessagesRequest = {
   pagination?: Pagination;
};

export type GetMessagesResponse = WithPagination<WithTotal<WithId<Message>>>;

export type MarkMessagesRequest = {
   ids: Id[];
}