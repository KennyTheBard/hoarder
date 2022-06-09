import { Button, Center, Checkbox, Container, Group, Input, MultiSelect, Space, Stack } from '@mantine/core';
import { Refresh, Search } from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getArchivedBookmarks, getBookmarks } from '../../redux/slices';
import { ChangeEvent, useEffect, useState } from 'react';
import { BoardFeed } from './feed';
import { getTypeOptions } from '../../utils';
import { BookmarkType } from '../../models';


export type BookmarkSearchForm = {
   searchTerm?: string;
   types?: BookmarkType[];
}

export function BookmarkList() {

   const dispatch = useAppDispatch();

   const bookmarks = useAppSelector((state) => state.bookmarkList.bookmarks);

   const [searchForm, setSearchForm] = useState<BookmarkSearchForm>({});
   const [showArchived, setShowArchived] = useState<boolean>(false);

   const refreshData = () => {
      dispatch(showArchived ? getArchivedBookmarks() : getBookmarks());
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
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchForm({
                           ...searchForm,
                           searchTerm: event.target.value.length > 0 ? event.target.value : undefined
                        })}
                     />
                     <MultiSelect
                        data={getTypeOptions()}
                        placeholder="Filter types..."
                        maxDropdownHeight={160}
                        clearable
                        onChange={(types: BookmarkType[]) => setSearchForm({
                           ...searchForm,
                           types: types.length > 0 ? types : undefined
                        })}
                        sx={{ width: 350 }}
                     />
                     <Checkbox
                        label="Archived"
                        checked={showArchived}
                        onChange={(event) => setShowArchived(event.currentTarget.checked)}
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