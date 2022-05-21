import { MovieDb } from 'moviedb-promise';
import { MovieDbCandidate } from '../models';
import { Client as OmdbClient, SearchResult, Movie, TVShow } from 'imdb-api';
import { map } from 'lodash';


export class ShowMetadataService {

   constructor(
      private readonly movieDbClient: MovieDb,
      private readonly omdbClient: OmdbClient,
   ) { }

   public async getShowDbCandidates(searchTerm: string): Promise<MovieDbCandidate[]> {
      const { results } = await this.omdbClient.search({
         name: searchTerm,
         reqtype: 'series'
      })

      const candidates: Movie[] = await Promise.all(results
         .map(result => this.omdbClient.get({ id: result.imdbid }))
      );

      return candidates
         .map((candidate: Movie) => candidate as TVShow)
         .map((result: TVShow) => ({
            title: result.name,
            releaseDate: result.year,
            posterUrl: `https://image.tmdb.org/t/p/w300${result.poster_path}`,
            imdbId: result.imdbid,
            imdbUrl: `https://www.imdb.com/title${result.imdb_id}`
         }));
   }

}