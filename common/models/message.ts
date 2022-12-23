

export type Message = {
   text: string;
   sendAt: number;
   status: MessageStatus;
};

export enum MessageStatus {
   PENDING = 'pending',
   PROCESSED = 'processed',
   IGNORED = 'ignored',
}