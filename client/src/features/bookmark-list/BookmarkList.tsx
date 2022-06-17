import { Button, Center, Checkbox, Container, Group, Input, Loader, MultiSelect, Space, Stack, Text } from '@mantine/core';
import { Refresh, Search } from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getBookmarks, getTags, setSearchTermAndUpdate, setShowArchived, setTypesAndUpdate } from '../../redux/slices';
import { ChangeEvent, useEffect } from 'react';
import { BoardFeed } from './feed';
import { getTypeOptions } from '../../utils';
import { BookmarkType } from 'common';


export function BookmarkList() {

   const dispatch = useAppDispatch();

   const bookmarks = useAppSelector((state) => state.bookmarkList.bookmarks);
   const loading = useAppSelector((state) => state.bookmarkList.loading);
   const showArchived = useAppSelector((state) => state.searchForm.showArchived);
   const searchForm = useAppSelector((state) => state.searchForm.searchForm);

   const refreshData = () => {
      dispatch(getBookmarks());
      dispatch(getTags());
   };

   useEffect(refreshData, [showArchived]);

   return (
      <>
         <Container size="xl">
            <Stack mt="50px">
               <Center>
                  <Group position="apart">
                     <Input
                        icon={<Search size={16} />}
                        placeholder="Search..."
                        value={searchForm.searchTerm}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => dispatch(setSearchTermAndUpdate(event.target.value))}
                     />
                     <MultiSelect
                        data={getTypeOptions()}
                        placeholder="Filter types..."
                        maxDropdownHeight={160}
                        clearable
                        onChange={(types: BookmarkType[]) => dispatch(setTypesAndUpdate(types))}
                        sx={{ width: 350 }}
                     />
                     <Checkbox
                        label="Archived"
                        checked={showArchived}
                        onChange={(event) => dispatch(setShowArchived(event.currentTarget.checked))}
                     />
                     <Button
                        leftIcon={<Refresh size={16} />}
                        onClick={refreshData}
                     >
                        Refresh
                     </Button>
                  </Group>

               </Center>
               <Space h={20} />

               {loading
                  ? <Center><Loader color="red" size="xl" variant="dots" /></Center>
                  : bookmarks.length > 0
                     ? <BoardFeed bookmarks={bookmarks} columnCount={4} />
                     : <Center>
                        <Text size="xl" color="grey" weight="lighter" ml="20px">No bookmarks found</Text>
                     </Center>
               }
            </Stack>
         </Container>
      </>
   );
}