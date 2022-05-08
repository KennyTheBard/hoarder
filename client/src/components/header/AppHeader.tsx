import { Anchor, Button, Group, Header, Image } from '@mantine/core'
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { getBookmarks } from '../../redux/slices/bookmarkListSlice';
import { Bookmark as BookmarkIcon } from 'tabler-icons-react';
import { setOpened } from '../../redux/slices';


export function AppHeader() {

   const dispatch = useAppDispatch();

   return (
      <Header height={60} p="xs">
         <Group position="apart">
            <Anchor component={Link} to="/">
               <Image
                  radius="md"
                  src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
                  alt="Random unsplash image"
                  width={50} height={50} />
            </Anchor>

            <Group position="right">
               <Button onClick={() => dispatch(getBookmarks({
                  size: 20, index: 0
               }))}>
                  Refresh
               </Button>
               <Button>
                  Tags
               </Button>
               <Button
                  color="red"
                  leftIcon={<BookmarkIcon />}
                  onClick={() => dispatch(setOpened(true))}
               >
                  Bookmark
               </Button>
            </Group>
         </Group>
      </Header>

   );
}