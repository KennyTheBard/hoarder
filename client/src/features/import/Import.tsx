import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { GeneralDropzone } from './GeneralDropzone';
import { dataService } from '../../services/data-service';
import { useModals } from '@mantine/modals';
import { AddBookmarkForm } from '../../components';
import { Bookmark } from 'common';


export function Import() {

   const modals = useModals();
   const [filesToImport, setFilesToImport] = useState<File[] | null>(null);
   const [importType, setImportType] = useState<'none' | 'partial' | 'database'>('none');
   const [dataToImport, setDataToImport] = useState<Partial<Bookmark>[]>([]);

   useEffect(() => {
      if (importType === 'none') {
         return;
      }

      if (!filesToImport) {
         setImportType('none');
         return;
      }

      const importDatabaseData = async (files: File[]): Promise<void> => {
         const file = files[0];
         const fileContent = await file.text();
         const data = JSON.parse(fileContent);
         await dataService.importData(data);
         setFilesToImport([]);
      }
      if (importType === 'database') {
         importDatabaseData(filesToImport);
      }

      const importPartialData = async (files: File[]): Promise<void> => {
         const firstFile = files[0];
         const content = await firstFile.text();
         const data = JSON.parse(content);
         setDataToImport(data);
      }
      if (importType === 'partial') {
         importPartialData(filesToImport);
      }
   }, [filesToImport, importType]);

   const enableButtons = importType === 'none' && filesToImport !== null && filesToImport.length > 0;

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
               setDataToImport(dataToImport.slice(1));
            }}>
            <AddBookmarkForm
               origin="import_tool"
               bookmark={dataToImport[0]}
               onCompleted={() => setDataToImport(dataToImport.slice(1))}
            />
         </Modal>
         <GeneralDropzone
            onDrop={(files) => setFilesToImport(files)}
            onReject={(filesReject) => console.log(filesReject)}
         />
         {filesToImport && filesToImport.map((file) => (
            <Text key={file.name}>{file.name}</Text>
         ))}
         <Text>
            What kind of import file is this?
         </Text>
         <Group>
            <Button
               disabled={!enableButtons}
               onClick={() => setImportType('database')}
            >
               Database
            </Button>
            <Button
               disabled={!enableButtons}
               onClick={() => setImportType('partial')}
            >
               Partial data
            </Button>
         </Group>
      </Stack>
   );
}