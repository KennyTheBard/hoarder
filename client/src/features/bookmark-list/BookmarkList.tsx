import { Button, Center, Container, Input, Space, Stack } from '@mantine/core';
import { Search } from 'tabler-icons-react';
import { useAppDispatch } from '../../redux/hooks';
import { getArchivedBookmarks, getBookmarks } from '../../redux/slices';
import { useEffect, useState } from 'react';
import { BoardFeed } from './feed';
import { WithCount, WithId } from '../../utils';
import { Bookmark } from '../../models';

export type BookmarkListProps = {
   isArchive?: boolean
};

export function BookmarkList(props: BookmarkListProps) {

   const dispatch = useAppDispatch();
   const [bookmarks, setBookmarks] = useState<WithId<Bookmark>[]>([]);

   const refreshData = () => {
      (props.isArchive ? dispatch(getArchivedBookmarks()) : dispatch(getBookmarks()))
         .unwrap()
         .then((bookmarks: WithId<Bookmark>[]) => setBookmarks(bookmarks));
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