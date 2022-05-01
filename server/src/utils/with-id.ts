

export type WithId<T> = {
   [P in keyof T]: T[P];
} & {
   _id: string;
};