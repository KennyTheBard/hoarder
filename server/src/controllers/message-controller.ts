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

   public ignoreMessages = async (request: IgnoreMessagesRequest): Promise<void> => {
      await this.messageService.setMessagesStatus(request.ids, MessageStatus.IGNORED);
   }

}

export type GetMessagesRequest = {
   pagination?: Pagination;
};

export type GetMessagesResponse = WithPagination<WithTotal<WithId<Message>>>;

export type IgnoreMessagesRequest = {
   ids: Id[];
}