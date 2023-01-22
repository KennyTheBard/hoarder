import { Button, Checkbox, Container, Space, Stack } from '@mantine/core';
import { useState } from 'react';
import { BookmarkTypesChecklist } from './BookmarkTypesChecklist';
import { dataService } from '../../services/data-service';
import dateFormat from 'dateformat';


export function Export() {

   const [shouldExportArhived, setShouldExportArhived] = useState(false);

   const [exportInProgress, setExportInProgress] = useState(false);

   return (
      <Stack align="center" justify="flex-start">
         <Container>
            <BookmarkTypesChecklist />
            <Checkbox
               mt="xs"
               label="Export archived bookmarks as well"
               checked={shouldExportArhived}
               onChange={(event) => setShouldExportArhived(event.currentTarget.checked)}
            />
            <Space h={20} />
            <Button
               loading={exportInProgress}
               onClick={() => {
                  setExportInProgress(true);
                  dataService.exportData().then((response) => {
                     const url = URL.createObjectURL(new Blob([JSON.stringify(response.data.rawData, null, 2)], { type: "text/plain" }));
                     const link = document.createElement("a");
                     link.download = `hoarder_export_${dateFormat(new Date(), "yyyy_mm_dd_HH_MM_ss")}.json`;
                     link.href = url;
                     link.click();
                     setExportInProgress(false);
                  })
               }}>
               Export
            </Button>
         </Container>
      </Stack>
   );
}