import { MessageService } from './message-service';
import telebot from 'telebot';
import { Bookmark, Id, Tag, WithId } from 'common';
import { BookmarkService } from './bookmark-service';

const INTERACTION_FIELD_SEPARATOR = ':';
const DROPCAN_CHAT_ID = -1001457135508;
export class TelegramBotService {
   readonly bot: telebot;

   constructor(
      botToken: string,
      private readonly bookmarkService: BookmarkService,
      private readonly messageService: MessageService,
   ) {
      this.bot = new telebot({
         token: botToken
      });

      this.bot.start();
      this.bot.on('text', this.messageHandler);
      this.bot.on('channel_post', this.messageHandler);
      this.bot.on('callbackQuery', this.callbackHandler);
   }

   private messageHandler = async (msg: any) => {
      if (msg.text.indexOf('/start') > -1) {
         return this.bot.sendMessage(msg.from.id, 'I await your command!');
      }
      await this.messageService.addPendingMessage(msg.text, msg.date);
   }

   private callbackHandler = async (msg: any) => {
      const messageId = msg.message.message_id;
      const data = msg.data;
      const [action, bookmarkId] = data.split(INTERACTION_FIELD_SEPARATOR);
      if (action === 'hide') {
         await this.bot.deleteMessage(DROPCAN_CHAT_ID, messageId);
      }
      if (action === 'archive') {
         await this.bookmarkService.archiveBookmark(bookmarkId, true);
         await this.bot.deleteMessage(DROPCAN_CHAT_ID, messageId);
         await this.confirmBookmarkArchival(bookmarkId);
      }
      if (action === 'unarchive') {
         await this.bookmarkService.archiveBookmark(bookmarkId, false);
         await this.bot.deleteMessage(DROPCAN_CHAT_ID, messageId);
         await this.bot.sendMessage(
            DROPCAN_CHAT_ID,
            `Bookmark has been moved out from archive`,
         );
      }
   }

   public sendBookmark = async (
      bookmark: WithId<Bookmark>,
      tags: WithId<Tag>[]
   ) => {
      await this.bot.sendMessage(
         DROPCAN_CHAT_ID,
         `${bookmark.title}\n${bookmark.note}\n${bookmark.url}\nTags: ${tags.map(tag => tag.name).join(', ')}`,
         {
            replyMarkup: {
               inline_keyboard: [
                  [{
                     text: "Archive",
                     callback_data: ["archive", bookmark.id].join(INTERACTION_FIELD_SEPARATOR)
                  }, {
                     text: "Hide",
                     callback_data: ["hide"].join(INTERACTION_FIELD_SEPARATOR)
                  }]
               ]
            }
         }   
      );
   }

   private confirmBookmarkArchival = async (
      bookmarkId: Id
   ) => {
      await this.bot.sendMessage(
         DROPCAN_CHAT_ID,
         `Bookmark has been archived`,
         {
            replyMarkup: {
               inline_keyboard: [
                  [{
                     text: "Un-archive",
                     callback_data: ["unarchive", bookmarkId].join(INTERACTION_FIELD_SEPARATOR)
                  }, {
                     text: "Hide",
                     callback_data: ["hide"].join(INTERACTION_FIELD_SEPARATOR)
                  }]
               ]
            }
         }   
      );
   }
}