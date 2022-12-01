import { GetMetadataCandidatesRequest, GetMetadataCandidatesResponse } from '../controllers';
import { InMemoryRequestCache } from './InMemoryRequestCache';

export class CandidateMetadataCache extends InMemoryRequestCache<GetMetadataCandidatesRequest, GetMetadataCandidatesResponse> {

   public computeKey(request: GetMetadataCandidatesRequest): string {
      return `${request.type}=${request.title}`;
   }
}