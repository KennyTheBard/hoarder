import { BookmarkType } from '..';

export type Id = string;

export type WithId<T> = {
   [P in keyof T]: T[P];
} & {
   id: Id;
};

export type WithTotal<T> = {
   total: number;
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

export type Pagination = {
   limit: number;
   skip?: number;
};

export type WithPagination<T> = {
   [P in keyof T]: T[P];
} & {
   pagination: Pagination;
};

export type Fn = () => void;