
export type Groups<T, U> = { group: T; reduction: U }[];

export type GroupCounts<T> = Groups<T, number>;
