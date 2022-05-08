import { Stack, Image, Text } from '@mantine/core';
import { Metadata } from '../../../models';

export type MetadataPreviewProps = {
   metadata: Metadata;
   ignore?: MetadataPreviewIgnore;
};

export type MetadataPreviewIgnore = {
   title?: boolean;
   description?: boolean;
   image?: boolean;
};

export function MetadataPreview(props: MetadataPreviewProps) {

   return (
      <Stack>
         {props.metadata.image && (!props.ignore || !props.ignore.image) &&
            <Image
               radius="md" fit="contain" height={300}
               src={props.metadata.image!}
               alt="Preview"
            />
         }
         {props.metadata.title && (!props.ignore || !props.ignore.title) &&
            <Text
               component="span"
               size="lg" weight={600}
            >
               {props.metadata.title!}
            </Text>
         }
         {props.metadata.description && (!props.ignore || !props.ignore.description) &&
            <Text
               component="span"
               size="md"
            >
               {props.metadata.description!}
            </Text>
         }
      </Stack>
   );
}