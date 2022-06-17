
export type Id = string;

export type WithId<T> = {
   [P in keyof T]: T[P];
} & {
   _id: Id;
};

export type WithCount<T> = {
   count: number;
   entries: T[];
}