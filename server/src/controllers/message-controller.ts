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

   public markMessages = async (request: MarkMessagesRequest): Promise<void> => {
      await this.messageService.setMessagesStatus(request.ids, request.status);
   }

}

export type GetMessagesRequest = {
   pagination?: Pagination;
   status?: MessageStatus;
};

export type GetMessagesResponse = WithPagination<WithTotal<WithId<Message>>>;

export type MarkMessagesRequest = {
   ids: Id[];
   status: MessageStatus;
}