import { Button, Checkbox, Container, Space, Stack } from '@mantine/core';
import { useState } from 'react';
import { BookmarkTypesChecklist } from './BookmarkTypesChecklist';


export function Export() {

   const [shouldExportArhived, setShouldExportArhived] = useState(false);

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
            <Button onClick={() => { }}>
               Export
            </Button>
         </Container>
      </Stack>
   );
}