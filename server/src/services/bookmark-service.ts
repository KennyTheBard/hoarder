import { Bookmark, BookmarkSearchForm, BookmarkType, Id, WithId } from 'common';
import { Connection, RTable } from 'rethinkdb-ts';
import { r } from 'rethinkdb-ts';
import { TableNames } from '../utils';

export class BookmarkService {

   constructor(
      private readonly connection: Connection,
   ) { }

   private get bookmarks(): RTable<WithId<Bookmark>> {
      return r.table(TableNames.BOOKMARKS);
   }

   public async addBookmark(bookmark: Bookmark): Promise<string> {
      const result = await r.table(TableNames.BOOKMARKS)
         .insert(bookmark)
         .run(this.connection);
      return result.generated_keys[0];
   }

   public async getBookmarks(form: BookmarkSearchForm): Promise<WithId<Bookmark>[]> {
      const query = this.bookmarks
         .filter({
            isArchived: form.isArchived
         })
         .limit(form.pagination.limit)
         .skip(form.pagination.skip || 0);


      if (form.types && form.types.length > 0) {
         query.filter(function (bookmark) {
            return bookmark('types').contains(form.types);
         })
      }

      if (form.tags && form.tags.length > 0) {
         query.filter(function (bookmark) {
            const condition = bookmark('tags').contains(form.tags[0]);
            for (let index = 1; index < form.tags.length; index++) {
               condition.or(bookmark('tags').contains(form.tags[index]))
            }
            return condition;
         })
      }

      if (form.searchTerm && form.searchTerm.length > 0) {
         const searchTerm = `(.*)${form.searchTerm}(.*)`;
         query.filter(function (bookmark) {
            return bookmark('title').downcase().match(searchTerm).ne(null)
               .or(bookmark('note').downcase().match(searchTerm).ne(null));
         })
      }
      return query.run(this.connection);
   }

   public async updateBookmark(id: string, bookmark: Partial<Bookmark>): Promise<void> {
      await this.bookmarks
         .get(id)
         .update(bookmark)
         .run(this.connection);
   }

   public async removeTagsFromAllBookmarks(tagIds: Id[]): Promise<void> {
      if (tagIds.length === 0) {
         return;
      }

      const bookmarksToUpdate = await this.bookmarks
         .filter(function (bookmark) {
            const condition = bookmark('tags').contains(tagIds[0]);
            for (let index = 1; index < tagIds.length; index++) {
               condition.or(bookmark('tags').contains(tagIds[index]))
            }
            return condition;
         })
         .run(this.connection);
      if (bookmarksToUpdate.length === 0) {
         return;
      }

      const updatedBookmarks = bookmarksToUpdate.map(bookmark => ({
         ...bookmark,
         tags: bookmark.tags.filter(tagId => !tagIds.includes(tagId))
      }))
      await this.bookmarks
         .insert(updatedBookmarks, { conflict: 'update' })
         .run(this.connection);
   }

   public async deleteBookmark(id: string): Promise<void> {
      const result = await this.bookmarks
         .get(id)
         .delete()
         .run(this.connection);
      if (result.deleted === 0) {
         throw new Error(`Could not delete bookmark with id '${id}'`);
      }
   }

   public async archiveBookmark(id: string, isArchived: boolean): Promise<void> {
      await this.bookmarks
         .get(id)
         .update({
            isArchived
         })
         .run(this.connection);
   }

   public async getTypeCountByHostname(hostname: string): Promise<Record<BookmarkType, number>> {
      const results: { group: BookmarkType; reduction: number }[] = await r.table(TableNames.BOOKMARKS)
         .filter({
            hostname
         })
         .group('type')
         .count()
         .run(this.connection) as unknown as { group: BookmarkType; reduction: number }[];

      const typeCountDictionary: Record<string, number> = {};
      results.forEach(result => typeCountDictionary[result.group] = result.reduction);
      return typeCountDictionary;
   }

   public async getBookmarkByUrl(url: string): Promise<WithId<Bookmark> | null> {
      const bookmark = await this.bookmarks
         .filter({
            url
         })
         .run(this.connection);

      if (bookmark.length === 0) {
         return null;
      }
      return bookmark[0];
   }
}
