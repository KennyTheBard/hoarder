import { Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { GeneralDropzone } from './GeneralDropzone';
import { dataService } from '../../services/data-service';


export function Import() {

   const [filesToImport, setFilesToImport] = useState<File[] | null>(null);

   useEffect(() => {
      if (!filesToImport) {
         return;
      }

      importData(filesToImport);
   }, [filesToImport]);

   const importData = async (files: File[]): Promise<void> => {
      if (files.length !== 1) {
         return;
      }
      const file = files[0];
      const fileContent = await file.text();
      const data = JSON.parse(fileContent);
      await dataService.importData(data);
   }

   return (
      <Stack align="center" justify="flex-start">
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