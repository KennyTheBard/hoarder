import { WithId, Message, MessageStatus, Pagination, WithTotal } from 'common';
import { Connection, RTable, r } from 'rethinkdb-ts';
import { TableNames } from '../utils';


export class MessageService {

   constructor(
      private readonly connection: Connection,
   ) { }

   private get messages(): RTable<WithId<Message>> {
      return r.table(TableNames.MESSAGES);
   }

   public async addPendingMessage(text: string, sendAt: number): Promise<string> {
      const result = await r.table(TableNames.MESSAGES)
         .insert({
            text,
            sendAt,
            status: MessageStatus.PENDING
         })
         .run(this.connection);
      return result.generated_keys[0];
   }

   public async getPendingMessages(pagination: Pagination): Promise<WithTotal<WithId<Message>>> {
      const query = this.messages
         .filter(m => m('status').eq(MessageStatus.PENDING))
         .orderBy(r.desc('sendAt'));
      const entries = await query
         .skip(pagination.skip || 0)
         .limit(pagination.limit)
         .run(this.connection);
      const total = await query
         .count()
         .run(this.connection);

      return {
         entries,
         total
      }
   }

   public async setMessageStatus(messageId: string, status: MessageStatus): Promise<boolean> {
      const result = await this.messages
         .get(messageId)
         .update({
            status
         })
         .run(this.connection);
      return result.replaced === 1;
   }

}