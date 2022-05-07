import { Stack, Image, Text } from '@mantine/core';
import { Metadata } from '../../../models';

export type MetadataPreviewProps = {
   metadata: Metadata;
   ignore: {
      title: boolean;
      image: boolean;
   }
};

export function MetadataPreview(props: MetadataPreviewProps) {

   return (
      <Stack>
         {props.metadata.image && !props.ignore.image &&
            <Image
               radius="md"
               src={props.metadata.image!}
               alt="Preview"
            />
         }
         {props.metadata.title && !props.ignore.title &&
            <Text
               component="span"
               size="lg" weight={600}
            >
               {props.metadata.title!}
            </Text>
         }
      </Stack>
   );
}