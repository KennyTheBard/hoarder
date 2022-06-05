import { Button, Dialog, Group, TextInput, Text, Image } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useState } from 'react';
import { AddBookmarkForm } from '../bookmark-form';



export function PinDialog() {
   const modals = useModals();

   const [url, setUrl] = useState<string>('')
   const [openedAddBookmarkModal, setOpenedAddBookmarkModal] = useState(false);

   return (
      <Dialog
         opened={!openedAddBookmarkModal}
         size="lg"
         radius="md"
      >
         <Text size="sm" style={{ marginBottom: 10 }} weight={500}>
            Found something cool? Pin it!
         </Text>

         <Group align="flex-end">
            <TextInput
               value={url}
               placeholder="Something... OR http://..." style={{ flex: 1 }}
               onChange={(event) => setUrl(event.target.value)}
            />
            <Button
               color="dark"
               onClick={() => {
                  setOpenedAddBookmarkModal(true);
                  modals.openModal({
                     title: "Add bookmark",
                     padding: "md",
                     size: "xl",
                     centered: true,
                     onClose: () => setOpenedAddBookmarkModal(false),
                     children: (
                        <AddBookmarkForm origin="pin_dialog" pinnedText={url}/>
                     )
                  });
               }}
            >
               <Image
                  radius="md"
                  src="/HoarderLogo.svg"
                  alt="Pin"
                  width={25} height={25} />
            </Button>
         </Group>
      </Dialog>
   );
}