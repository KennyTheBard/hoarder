import { TvResult, ShowResponse } from 'moviedb-promise/dist/request-types';
import { MovieResult, MovieResponse } from 'moviedb-promise/dist/request-types';
import { MovieDb } from 'moviedb-promise';
import { Client as OmdbClient } from 'imdb-api';
import axios from 'axios';
import * as iso8601 from 'iso8601-duration';
import { TypeSpecificMetadata, MovieBookmark, ShowBookmark, AnimeBookmark } from 'common';

export class MediaCandidatesService {

   constructor(
      private readonly movieDbClient: MovieDb,
      private readonly omdbClient: OmdbClient,
   ) { }

   public async getMovieCandidates(searchTerm: string): Promise<TypeSpecificMetadata<MovieBookmark>[]> {
      const results: MovieResult[] = (await this.movieDbClient.searchMovie({
         query: searchTerm
      })).results;

      const candidates = await Promise.all(results
         .filter(result => result.id)
         .map(result => this.movieDbClient.movieInfo({ id: result.id }))
      );

      return candidates
         .filter((result: MovieResponse) => result.imdb_id && result.poster_path)
         .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
         .map((result: MovieResponse) => ({
            title: result.title,
            candidateId: result.id,
            releaseYear: parseInt(result.release_date.split('-')[0]),
            imageUrl: `https://image.tmdb.org/t/p/w300${result.poster_path}`,
            imdbId: result.imdb_id,
            url: `https://www.imdb.com/title/${result.imdb_id}`,
            imdbRating: result.vote_average
         }));
   }

   public async getShowCandidates(searchTerm: string): Promise<TypeSpecificMetadata<ShowBookmark>[]> {
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
            candidateId: result.id,
            releaseYear: parseInt(result.first_air_date.split('-')[0]),
            imageUrl: `https://image.tmdb.org/t/p/w300${result.poster_path}`,
            imdbId: result.imdb_id,
            url: `https://www.imdb.com/title/${result.imdb_id}`
         }));
   }

   public async getAnimeCandidates(searchTerm: string): Promise<TypeSpecificMetadata<AnimeBookmark>[]> {
      try {
         const candidates = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURI(searchTerm)}`);

         return candidates.data.data
            .map(candidate => ({
               title: `${candidate.title}`,
               url: candidate.url,
               imageUrl: candidate.images.jpg.image_url,
               candidateId: candidate.mal_id,
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

   public async getVideoDurationInSeconds(url: string): Promise<number> {
      const urlObject = new URL(url);
      let videoId = '';
      if ( urlObject.hostname === 'www.youtube.com') {
         videoId = urlObject.searchParams.get('v');
      }
      if ( urlObject.hostname === 'youtu.be') {
         videoId = urlObject.pathname.split('/')[1];
      }
      const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${process.env.GOOGLE_API_KEY}`)
      return iso8601.toSeconds(iso8601.parse(data.items[0].contentDetails.duration));
   }

}