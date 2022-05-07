
export type MetadataComplete = {
   images: string[];
   meta: {
      description?: string;
      title?: string;
   };
   og: {
      image?: string;
      description?: string;
      title?: string;
      site_name?: string;
      type?: string;
      url?: string;
   };
}

export interface Metadata {
   title: string | null;
   description: string | null;
   image: string | null;
   siteName: string | null;
   hostname: string | null;
}