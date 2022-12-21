import { Id, Tag, TagExtended, WithId } from 'common';
import { Connection, RTable, r } from 'rethinkdb-ts';
import { TableNames } from '../utils';
import { GroupCounts } from '../utils/rethinkdb';

export class TagService {

   constructor(
      private readonly connection: Connection,
   ) { }

   private get tags(): RTable<WithId<Tag>> {
      return r.table(TableNames.TAGS);
   }

   public async addTag(tag: Tag): Promise<string> {
      const extistingTag = await this.tags
         .filter({
            name: tag.name
         })
         .limit(1)
         .run(this.connection);

      if (extistingTag.length > 0) {
         throw new Error('Tag already exists');
      }

      const result = await r.table(TableNames.TAGS)
         .insert(tag)
         .run(this.connection);
      return result.generated_keys[0];
   }

   public async getAllTags(): Promise<WithId<Tag>[]> {
      return this.tags.run(this.connection);
   }

   public async getTagsExtended(): Promise<WithId<TagExtended>[]> {
      const tags = await this.tags.run(this.connection);
      const tagBookmarkCounts: GroupCounts<Id> = await r.table(TableNames.TAGS)
         .concatMap((tag) => {
            return r.table(TableNames.BOOKMARKS)
               .filter((bookmark) => bookmark('tags').contains(tag('id')))
               .map((bookmark) => ({
                  left: tag('id'),
                  right: bookmark('id')
               }))
         })
         .group('left')
         .count()
         .run(this.connection) as unknown as GroupCounts<Id>;
      const tagFqMap: Record<Id, number> = tagBookmarkCounts.reduce(
         (record, tagBookmarkCount) => {
            record[tagBookmarkCount.group] = tagBookmarkCount.reduction;
            return record;
         },
         {}
      );

      return tags.map((tag) => ({
         ...tag,
         bookmarksCount: tagFqMap[tag.id] || 0
      }));
   }

   public async getTagById(id: string): Promise<WithId<Tag>> {
      return await this.tags.get(id).run(this.connection);
   }

   public async updateTag(id: string, tag: Tag): Promise<void> {
      await this.tags
         .get(id)
         .update(tag)
         .run(this.connection);
   }

   public async deleteTags(ids: Id[]): Promise<void> {
      await this.tags
         .getAll(ids)
         .delete()
         .run(this.connection);
   }

}