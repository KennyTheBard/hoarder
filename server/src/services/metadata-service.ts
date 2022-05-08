import parser from 'html-metadata-parser';
import { Metadata, MetadataComplete } from '../models';



export class MetadataService {

   public async getMetadata(url: string): Promise<Metadata> {
      const result = (await parser(url, {
         headers: {
            'Accept-Encoding': 'gzip,deflate,br',
         },
      })) as MetadataComplete;
      return this.metadataCompleteToMetadata(url, result);
   };

   private metadataCompleteToMetadata(url: string, metadata: MetadataComplete): Metadata {
      const { images, og, meta } = metadata;
      let image = og.image
         ? og.image
         : images.length > 0
            ? images[0]
            : null;
      const description = og.description
         ? og.description
         : meta.description
            ? meta.description
            : null;
      const title = (og.title ? og.title : meta.title) || '';
      const siteName = og.site_name || '';
      const { hostname } = new URL(url);

      return {
         url,
         title,
         description,
         image,
         siteName,
         hostname,
      };
   }
}