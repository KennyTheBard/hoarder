import { Modal, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { AddBookmarkForm, AddBookmarkFormProps } from '../../../components';
import { GeneralDropzone } from './GeneralDropzone';



function entryToAddBookmarkFormProps(entry: { [key: string]: any }): AddBookmarkFormProps {
   const props: AddBookmarkFormProps = {
      origin: 'import_tool'
   };

   if (entry.url) props.url = entry.url;
   if (entry.note) props.note = entry.note;

   return props;
}

export function Import() {

   const [filesToImport, setFilesToImport] = useState<File[] | null>(null);
   const [dataToImport, setDataToImport] = useState<AddBookmarkFormProps[]>([]);
   
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
   
   return (
      <Stack align="center" justify="flex-start">
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
         <GeneralDropzone
            onDrop={(files) => setFilesToImport(files)}
            onReject={(filesReject) => console.log(filesReject)}
         />
         {filesToImport && filesToImport.map((file) => (
            <Text key={file.name}>{file.name}</Text>
         ))}
      </Stack>
   );
}