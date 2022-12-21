import { Group, Stack, Text } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { Upload, Photo, X, Icon as TablerIcon } from 'tabler-icons-react';
import { FileRejection } from 'react-dropzone';

export type GeneralDropzoneProps = {
   onDrop: (files: File[]) => void
   onReject?: (fileRejections: FileRejection[]) => void
};

export function GeneralDropzone(props: GeneralDropzoneProps) {
   
   return (
      <Dropzone
         onDrop={props.onDrop}
         onReject={props.onReject ? props.onReject : () => { }}
         maxSize={3 * 1024 ** 2}
      >
         <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
            <Dropzone.Accept>
               <Upload
                  size={50}
                  stroke="1.5"
               />
            </Dropzone.Accept>
            <Dropzone.Reject>
               <X
                  size={50}
                  stroke="1.5"
               />
            </Dropzone.Reject>
            <Dropzone.Idle>
               <Photo size={50} stroke="1.5" />
            </Dropzone.Idle>

            <Stack spacing="xs">
               <Text size="xl" inline>
                  Import data from Hoarder bundle
               </Text>
               <Text size="sm" color="dimmed" inline mt={7}>
                  This will only work for data exported with Hoarder
               </Text>
            </Stack>
         </Group>
      </Dropzone>
   );
}