

export type WithId<T> = {
   [P in keyof T]: T[P];
} & {
   _id: string;
};

export type WithCount<T> = {
   count: number;
   entries: T[];
}