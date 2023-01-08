import { WithId, Message, MessageStatus, Pagination, WithTotal, Id } from 'common';
import { Connection, RTable, r } from 'rethinkdb-ts';
import { TableNames } from '../utils';
import { GetMessagesRequest } from '../controllers';


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

   public async getPendingMessages(request: GetMessagesRequest): Promise<WithTotal<WithId<Message>>> {
      const query = this.messages
         .filter(m => r.or(r.expr(request.showOnlyPending).not(), m('status').eq(MessageStatus.PENDING)))
         .orderBy(r.desc('sendAt'));
      const entries = await query
         .skip(request.pagination.skip || 0)
         .limit(request.pagination.limit)
         .run(this.connection);
      const total = await query
         .count()
         .run(this.connection);

      return {
         entries,
         total
      }
   }

   public async setMessagesStatus(messageIds: Id[], status: MessageStatus): Promise<boolean> {
      const result = await this.messages
         .getAll(r.args(messageIds))
         .update({
            status
         })
         .run(this.connection);
      return result.replaced === 1;
   }

}