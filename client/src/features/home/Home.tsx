import { Button, Center, Container, Input, Space, Stack } from '@mantine/core';
import { Search } from 'tabler-icons-react';
import { useAppDispatch } from '../../redux/hooks';
import { getBookmarks } from '../../redux/slices';
import { useEffect } from 'react';
import { BoardFeed } from './feed';

export function Home() {

   const dispatch = useAppDispatch();
 
   useEffect(() => {
      dispatch(getBookmarks());
   }, []);

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
                  <Button onClick={() => dispatch(getBookmarks())}>
                     Refresh
                  </Button>
               </Center>
               <Space h={20} />
               <BoardFeed columnCount={4} />
               {/* TODO: add loading more spinner or "that's all" */}
               <Space h={100} />
            </Stack>
         </Container>
      </>
   );
}