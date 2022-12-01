import { BookmarkType } from '..';

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

export type WithQuery<T> = {
   [P in keyof T]: T[P];
} & {
   query: string;
};

export type WithType<T> = {
   [P in keyof T]: T[P];
} & {
   type: BookmarkType;
};

export type Fn = () => void;