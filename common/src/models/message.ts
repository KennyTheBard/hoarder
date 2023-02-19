

export type Message = {
   text: string;
   sendAt: number;
   status: MessageStatus;
};

export enum MessageStatus {
   PENDING = 'pending',
   BOOKMARKED = 'bookmarked',
   IGNORED = 'ignored',
};
