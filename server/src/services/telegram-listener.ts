import { stringify } from './../../../client/node_modules/@types/uuid/index.d';
import { MessageService } from './message-service';
import telebot from 'telebot';


const DROPCAN_CHAT_ID = -1001457135508;
export class TelegramBotService {
   readonly bot: telebot;

   constructor(
      botToken: string,
      private readonly messageService: MessageService
   ) {
      this.bot = new telebot({
         token: botToken
      });

      this.bot.start();
      this.bot.on('text', this.messageHandler);
      this.bot.on('channel_post', this.messageHandler);
   }

   private messageHandler = async (msg: any) => {
      if (msg.text.indexOf('/start') > -1) {
         return this.bot.sendMessage(msg.from.id, 'I await your command!');
      }
      console.log(msg);
      await this.messageService.addPendingMessage(msg.text, msg.date);
   }

   public sendMessage = async (message: string) => {
      await this.bot.sendMessage(DROPCAN_CHAT_ID, message);
   }
}