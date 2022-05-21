import { MovieResult, MovieResponse } from './../../node_modules/moviedb-promise/dist/request-types.d';
import { MovieDb } from 'moviedb-promise';
import { MovieDbCandidate } from '../models';
import { Client as OmdbClient } from 'imdb-api';


export class MovieMetadataService {

   constructor(
      private readonly movieDbClient: MovieDb,
      private readonly omdbClient: OmdbClient,
   ) {}

   public async getMovieDbCandidates(searchTerm: string): Promise<MovieDbCandidate[]> {
      const results: MovieResult[] = (await this.movieDbClient.searchMovie({
         query: searchTerm
      })).results;

      const candidates = await Promise.all(results
         .filter(candidate => !candidate.id)
         .map(candidate => this.movieDbClient.movieInfo({ id: candidate.id }))
      );

      return candidates.map((result: MovieResponse) => ({
         id: result.id,
         title: result.title,
         releaseDate: result.release_date,
         posterUrl: `https://image.tmdb.org/t/p/w300${result.poster_path}`,
         imdbId: result.imdb_id,
         imdbUrl: `https://www.imdb.com/title${result.imdb_id}`
      }));
   }

}