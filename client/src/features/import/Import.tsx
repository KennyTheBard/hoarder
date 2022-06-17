import { Modal, Stack, Text } from '@mantine/core';
import { Bookmark } from 'common';
import { useEffect, useState } from 'react';
import { AddBookmarkForm } from '../../components';
import { GeneralDropzone } from './GeneralDropzone';


export function Import() {

   const [filesToImport, setFilesToImport] = useState<File[] | null>(null);
   const [dataToImport, setDataToImport] = useState<Partial<Bookmark>[]>([]);

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
                  data.map((entry: { [key: string]: any; }) => entry as Partial<Bookmark>)
               );
            }))
         )
      ).then(
         (propsLists: unknown[]) => setDataToImport([
            ...dataToImport,
            ...(propsLists.flat(1) as Partial<Bookmark>[])
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
            <AddBookmarkForm origin="import_tool" bookmark={dataToImport[0]} onCompleted={() => setDataToImport(dataToImport.slice(1))} />
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