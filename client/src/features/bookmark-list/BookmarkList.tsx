import { Button, Center, Container, Input, Space, Stack } from '@mantine/core';
import { Search } from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getArchivedBookmarks, getBookmarks } from '../../redux/slices';
import { useEffect } from 'react';
import { BoardFeed } from './feed';

export type BookmarkListProps = {
   isArchive?: boolean
};

export function BookmarkList(props: BookmarkListProps) {

   const dispatch = useAppDispatch();

   const bookmarks = useAppSelector((state) => state.bookmarkList.bookmarks);

   const refreshData = () => {
      dispatch(props.isArchive ? getArchivedBookmarks() : getBookmarks());
   };

   useEffect(refreshData, [props.isArchive]);

   return (
      <>
         <Container size="xl">
            <Stack>
               <Space h={50} />
               <Center>
                  <Input
                     icon={<Search size={16} />}
                     placeholder="Search..."
                  />
                  <Button onClick={refreshData}>
                     Refresh
                  </Button>
               </Center>
               <Space h={20} />
               <BoardFeed bookmarks={bookmarks} columnCount={4} />
               {/* TODO: add loading more spinner or "that's all" */}
               <Space h={100} />
            </Stack>
         </Container>
      </>
   );
}