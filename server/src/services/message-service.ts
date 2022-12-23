import { WithId, Message, MessageStatus } from 'common';
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

}