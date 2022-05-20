import { MovieResult, MovieResponse } from './../../node_modules/moviedb-promise/dist/request-types.d';
import { MovieDb } from 'moviedb-promise';
import { MovieDbCandidate } from '../models';


export class MovieMetadataService {

   private readonly db: MovieDb;

   constructor(
      movieDbToken: string
   ) {
      this.db = new MovieDb(movieDbToken);
   }

   public async getMovieDbCandidates(searchTerm: string): Promise<MovieDbCandidate[]> {
      const results: MovieResult[] = (await this.db.searchMovie({
         query: searchTerm
      })).results;

      const candidates = await Promise.all(results
         .filter(candidate => !candidate.id)
         .map(candidate => this.db.movieInfo({ id: candidate.id }))
      );

      return candidates.map((result: MovieResponse) => ({
         id: result.id,
         title: result.title,
         releaseDate: result.release_date,
         posterUrl: `https://image.tmdb.org/t/p/w300${result.backdrop_path}`,
         imdbId: result.imdb_id,
         imdbUrl: `https://www.imdb.com/title${result.imdb_id}`
      }));
   }

}