import { TvResult, ShowResponse } from './../../node_modules/moviedb-promise/dist/request-types.d';
import { MovieResult, MovieResponse } from 'moviedb-promise/dist/request-types';
import { MovieDb } from 'moviedb-promise';
import { AnimeBookmark, MovieBookmark, ShowBookmark, TypeSpecificMetadata } from '../models';
import { Client as OmdbClient } from 'imdb-api';
import axios from 'axios';

export class MediaMetadataService {

   constructor(
      private readonly movieDbClient: MovieDb,
      private readonly omdbClient: OmdbClient,
   ) { }

   public async getMovieCandidates(searchTerm: string): Promise<TypeSpecificMetadata<MovieBookmark, 'movie'>[]> {
      const results: MovieResult[] = (await this.movieDbClient.searchMovie({
         query: searchTerm
      })).results;

      const candidates = await Promise.all(results
         .filter(result => result.id)
         .map(result => this.movieDbClient.movieInfo({ id: result.id }))
      );

      return candidates
         .filter((result: MovieResponse) => result.imdb_id && result.poster_path)
         .map((result: MovieResponse) => ({
            title: result.title,
            releaseYear: parseInt(result.release_date.split('-')[0]),
            imageUrl: `https://image.tmdb.org/t/p/w300${result.poster_path}`,
            imdbId: result.imdb_id,
            url: `https://www.imdb.com/title/${result.imdb_id}`
         }));
   }

   public async getShowCandidates(searchTerm: string): Promise<TypeSpecificMetadata<ShowBookmark, 'show'>[]> {
      const results: TvResult[] = (await this.movieDbClient.searchTv({
         query: searchTerm
      })).results;

      const [candidateIds, candidateInfos] = await Promise.all([
         Promise.all(results.map(result => this.movieDbClient.tvExternalIds(result.id))),
         Promise.all(results
            .filter(result => result.id)
            .map(result => this.movieDbClient.tvInfo({ id: result.id })))
      ]);

      const idToImdbId = {};
      candidateIds.forEach(candidateId => idToImdbId[candidateId.id] = candidateId);

      return candidateInfos
         .map((candidate) => ({
            ...candidate,
            imdb_id: idToImdbId[candidate.id].imdb_id
         }))
         .filter(result => result.imdb_id && result.poster_path)
         .map(result => ({
            title: result.name,
            releaseYear: parseInt(result.first_air_date.split('-')[0]),
            imageUrl: `https://image.tmdb.org/t/p/w300${result.poster_path}`,
            imdbId: result.imdb_id,
            url: `https://www.imdb.com/title/${result.imdb_id}`
         }));
   }

   public async getAnimeCandidates(searchTerm: string): Promise<TypeSpecificMetadata<AnimeBookmark, 'anime'>[]> {
      try {
         const candidates = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURI(searchTerm)}`);

         return candidates.data.data
            .map(candidate => ({
               title: `${candidate.title}`,
               url: candidate.url,
               imageUrl: candidate.images.jpg.image_url,
               myAnimeListScore: candidate.score,
               isOnNetflix: false,
               hasPremiered: candidate.airing || candidate.aired.to === null,
               releaseYear: candidate.aired.prop.from.year ?? undefined,
               myAnimeListReviewCount: candidate.scored_by,
               isFinished: !candidate.airing,
               finishedYear: candidate.aired.prop.to.year ?? undefined,
               isAdaptation: candidate.source.toLowerCase() !== 'original',
               episodeCount: candidate.episodes,
            }));
      } catch (error) {
         console.error(error);
         return [];
      }
      
   }

}