import { Button, Container, Divider, Group, Modal, Space, Stack, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useEffect, useState } from 'react';
import { AddBookmarkForm, AddBookmarkFormProps } from '../../components';
import { GeneralDropzone } from './dropzone/GeneralDropzone';


function entryToAddBookmarkFormProps(entry: { [key: string]: any }): AddBookmarkFormProps {
   const props: AddBookmarkFormProps = {
      origin: 'import_tool'
   };

   if (entry.url) props.url = entry.url;
   if (entry.note) props.note = entry.note;

   return props;
}

export function DataTool() {

   const modals = useModals();

   const [filesToImport, setFilesToImport] = useState<File[] | null>(null);
   const [dataToImport, setDataToImport] = useState<AddBookmarkFormProps[]>([])

   useEffect(() => {
      if (!filesToImport) {
         return;
      }

      Promise.all(
         filesToImport.map(file =>
            new Promise((resolve, reject) => file.text().then(fileContent => {
               const data = JSON.parse(fileContent);
               // TODO: validate data format
               resolve(
                  data.map((entry: { [key: string]: any; }) => entryToAddBookmarkFormProps(entry))
               );
            }))
         )
      ).then(
         (propsLists: unknown[]) => setDataToImport([
            ...dataToImport,
            ...(propsLists.flat(1) as AddBookmarkFormProps[])
         ])
      );
   }, [filesToImport]);

   // if (dataToImport.length > 0) {
   //    modals.openModal({
   //       title: "Add bookmark",
   //       padding: "md",
   //       size: "xl",
   //       centered: true,
   //       onClose: () => {
   //          setDataToImport(dataToImport.slice(1));
   //       },
   //       children: (
   //          <AddBookmarkForm {...dataToImport[0]} />
   //       )
   //    });
   // }

   return (
      <Container size="xl">
         <Modal
            key={dataToImport.length}
            title="Import bookmark"
            padding="md"
            size="xl"
            centered={true}
            opened={dataToImport.length > 0}
            onClose={() => {
               console.log(dataToImport)
               setDataToImport(dataToImport.slice(1));
            }}>
            <AddBookmarkForm {...dataToImport[0]} />
         </Modal>

         <Space h={50} />
         <Group position="center">
            <Stack align="center" justify="flex-start">
               <Container>
                  <Button onClick={() => { }}>
                     Export
                  </Button>
               </Container>
            </Stack>
            <Divider sx={{ height: '300px' }} size="sm" orientation="vertical" />
            <Stack align="center" justify="flex-start">
               <GeneralDropzone
                  onDrop={(files) => setFilesToImport(files)}
                  onReject={(filesReject) => console.log(filesReject)}
               />
               {filesToImport && filesToImport.map((file) => (
                  <Text key={file.name}>{file.name}</Text>
               ))}
            </Stack>
         </Group>
         <Space h={100} />

      </Container >
   );
}