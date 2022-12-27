import { Id, Message, MessageSearchForm, MessageStatus, WithId, WithPagination, WithTotal } from 'common';
import { MessageService } from '../services';


export class MessageController {

   constructor(
      private readonly messageService: MessageService,
   ) {}

   public getMessages = async (request: GetMessagesRequest): Promise<GetMessagesResponse> => {
      const result = await this.messageService.getPendingMessages(request);

      return {
         ...result,
         pagination: request.pagination,
      };
   }

   public markMessages = async (request: MarkMessagesRequest): Promise<void> => {
      await this.messageService.setMessagesStatus(request.ids, request.status);
   }

}

export type GetMessagesRequest = MessageSearchForm;

export type GetMessagesResponse = WithPagination<WithTotal<WithId<Message>>>;

export type MarkMessagesRequest = {
   ids: Id[];
   status: MessageStatus;
}