
export type Tag = {
   name: string;
   variant?: 'light' | 'filled';
   color?: string;
}

export type TagExtended = Tag & {
   bookmarksCount: number;
}