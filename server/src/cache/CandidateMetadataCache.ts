import { CandidateMetadata, WithQuery, WithType } from 'common';
import { InMemoryCache } from '.';

export type CachedCandidateMetadata = WithType<WithQuery<{
   candidates: CandidateMetadata[]
}>>;

export class CandidateMetadataCache extends InMemoryCache<CachedCandidateMetadata> {
   
   public computeKey(entity: WithQuery<CachedCandidateMetadata>): string {
      return `${entity.type}=${entity.query}`;
   }
}