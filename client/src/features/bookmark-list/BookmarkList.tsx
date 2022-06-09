import { Button, Center, Checkbox, Container, Group, Input, MultiSelect, Space, Stack } from '@mantine/core';
import { Refresh, Search } from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getBookmarks, setSearchTermAndUpdate, setShowArchived, setTypesAndUpdate } from '../../redux/slices';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { BoardFeed } from './feed';
import { getTypeOptions } from '../../utils';
import { BookmarkType } from '../../models';


export function BookmarkList() {

   const dispatch = useAppDispatch();

   const bookmarks = useAppSelector((state) => state.bookmarkList.bookmarks);
   const showArchived = useAppSelector((state) => state.searchForm.showArchived);
   const searchForm = useAppSelector((state) => state.searchForm.searchForm);

   const refreshData = () => {
      dispatch(getBookmarks());
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
               <BoardFeed bookmarks={bookmarks} columnCount={4} />
               {/* TODO: add loading more spinner or "that's all" */}
            </Stack>
         </Container>
      </>
   );
}