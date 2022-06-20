import { BookBookmark, TypeSpecificMetadata } from 'common';
import axios from 'axios';

export class OpenLibraryService {

   public getBookCandidates = async (bookTitle: string): Promise<TypeSpecificMetadata<BookBookmark>[]> => {
      const results = await this.searchBookByName(bookTitle.trim());

      return results
         .sort((a: OpenLibraryBookEntry, b: OpenLibraryBookEntry) => {
            if (!!this.getBookCoverUrl(a) === !!this.getBookCoverUrl(b)) {
               return 0;
            }
            if (!this.getBookCoverUrl(a)) {
               return 1;
            }
            if (!this.getBookCoverUrl(b)) {
               return -1;
            }
         })
         .slice(0, 10)
         .map((book: OpenLibraryBookEntry) => ({
            title: book.title,
            url: `https://openlibrary.org${book.key}`,
            imageUrl: this.getBookCoverUrl(book),
            candidateId: book.key,
            subtitle: book.subtitle,
            authors: book.author_name,
            amazonUrl: book.id_amazon?.length > 0 && `https://www.amazon.com/dp/${book.id_amazon[0]}`,
            publishYear: book.first_publish_year,
            isbn: book.isbn?.sort((a: string, b: string) => a.length - b.length)[0]
         }));
   }

   private searchBookByName = async (bookTitle: string): Promise<OpenLibraryBookEntry[]> => {
      const { data } = await axios.get(`http://openlibrary.org/search.json?q=${bookTitle}`);

      return (data as OpenLibrarySearchResponse).docs;
   }

   private getBookCoverUrl = (book: OpenLibraryBookEntry): string | undefined => {
      if (!book.cover_i) {
         return;
      }
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
   }

}

export type OpenLibrarySearchResponse = {
   numFound: number;
   start: number;
   docs: OpenLibraryBookEntry[];
}

export type OpenLibraryBookEntry = {
   key: string;
   title: string;
   subtitle?: string;
   author_name: string[];
   id_amazon?: string[];
   first_publish_year: number;
   cover_i?: number;
   isbn: string[];
}