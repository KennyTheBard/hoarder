export type WebResource = BaseResource<'web'> & {
   url: string,
   hostname: string
}

export type TextResource = BaseResource<'text'> & {
   content: string,
}

export type BaseResource<T extends string> = {
   type: T,
   tags: string[],
   createdTimestamp: number,
   updatedTimestamp: number
}
