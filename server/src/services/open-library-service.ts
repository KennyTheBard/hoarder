import axios from 'axios';

export class OpenLibraryService {

   public searchBookByName = async (bookName: string): Promise<OpenLibraryBookEntry[]> => {
      const { data } = await axios.get(`http://openlibrary.org/search.json?q=${bookName}`);

      return (data as OpenLibrarySearchResponse).docs;
   }

   public getBookCoverUrl = (book: OpenLibraryBookEntry): string | undefined => {
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
   title: string;
   subtitle?: string;
   author_name: string[];
   id_amazon?: string[];
   first_publish_year: number;
   cover_i?: number;
   isbn: string[]
}