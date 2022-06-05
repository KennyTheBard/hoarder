import { Group, Stack, Text } from '@mantine/core';
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Upload, Photo, X, Icon as TablerIcon } from 'tabler-icons-react';
import { FileRejection } from 'react-dropzone';

export type GeneralDropzoneProps = {
   onDrop: (files: File[]) => void
   onReject?: (fileRejections: FileRejection[]) => void
};

export function GeneralDropzone(props: GeneralDropzoneProps) {

   function ImageUploadIcon({
      status,
      ...props
   }: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
      if (status.accepted) {
         return <Upload {...props} />;
      }

      if (status.rejected) {
         return <X {...props} />;
      }

      return <Photo {...props} />;
   }

   const dropzoneChildren = (status: DropzoneStatus) => (
      <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
         <ImageUploadIcon status={status} style={{ color: status.accepted ? 'green' : (status.rejected ? 'red' : 'grey') }} size={80} />

         <Stack spacing="xs">
            <Text size="xl" inline>
               Import data from Hoarder bundle
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
               This will only work for data exported with Hoarder
            </Text>
         </Stack>
      </Group>
   );

   return (
      <Dropzone
         onDrop={props.onDrop}
         onReject={props.onReject ? props.onReject : () => {}}
         maxSize={3 * 1024 ** 2}
      >
         {(status) => dropzoneChildren(status)}
      </Dropzone>
   );
}