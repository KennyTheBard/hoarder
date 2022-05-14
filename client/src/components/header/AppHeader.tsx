import { Anchor, Button, Group, Header, Image, Stack, Text } from '@mantine/core'
import { Link } from 'react-router-dom';
import { Bookmark as BookmarkIcon } from 'tabler-icons-react';
import { useModals } from '@mantine/modals';
import { AddBookmarkForm } from '../bookmark-form';

export function AppHeader() {

   const modals = useModals();
   const openAddBookmarkModal = () =>
      modals.openModal({
         title: "Add bookmark",
         padding: "md",
         size: "xl",
         centered: true,
         children: (
            <AddBookmarkForm />
         )
      });

   return (
      <Header height={75} p="xs" sx={(theme) => ({
         backgroundColor: '#1F1F1F'
      })}>
         <Group position="apart">
            <Anchor component={Link} to="/">
               <Group>
                  <Image
                     radius="md"
                     src="/HoarderLogo.svg"
                     alt="Hoarder logo"
                     width={50} height={50} />
                  <Stack justify="flex-end"
                     style={{ height: 60 }}
                  >
                     <Text color="white"
                        style={{
                           fontWeight: 1000,
                           fontSize: 32
                        }}
                     >
                        Hoarder
                     </Text>
                  </Stack>
               </Group>
            </Anchor>

            <Group position="right">
               <Button component={Link} to="/">
                  Home
               </Button>
               <Button component={Link} to="/tags">
                  Tags
               </Button>
               <Button
                  color="red"
                  leftIcon={<BookmarkIcon />}
                  onClick={openAddBookmarkModal}
               >
                  Bookmark
               </Button>
            </Group>
         </Group>
      </Header>

   );
}