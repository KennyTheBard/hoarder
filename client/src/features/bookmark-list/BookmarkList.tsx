import { Affix, Button, Center, Checkbox, Container, Group, Input, Loader, MultiSelect, Space, Stack, Text, Transition } from '@mantine/core';
import { Refresh, Search, ArrowUp, ArrowRight } from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getBookmarks, getNextPage, getAllTags, setSearchTermAndUpdate, setShowArchived, setTypesAndUpdate } from '../../redux/slices';
import { ChangeEvent, useEffect } from 'react';
import { BoardFeed } from './feed';
import { getTypeOptions } from '../../utils';
import { BookmarkType } from 'common';
import { useElementSize, useViewportSize, useWindowScroll } from '@mantine/hooks';

export function BookmarkList() {

   const dispatch = useAppDispatch();
   const [scroll, scrollTo] = useWindowScroll();
   const { ref, height: elementHeight } = useElementSize();
   const { height: viewportHeight } = useViewportSize();

   const bookmarks = useAppSelector((state) => state.bookmarkList.bookmarks);
   const loading = useAppSelector((state) => state.bookmarkList.loading);
   const searchForm = useAppSelector((state) => state.searchForm);

   const refreshData = () => {
      dispatch(getBookmarks());
      dispatch(getAllTags());
   };
   useEffect(refreshData, [searchForm]);

   return (
      <>
         <Container size="xl" ref={ref}>
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
                        checked={searchForm.isArchived}
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
            <Affix position={{ bottom: 20, left: 20 }}>
               <Transition transition="slide-up" mounted={scroll.y + viewportHeight > elementHeight - 400}>
                  {(transitionStyles) => (
                     <Group>
                        <Button
                           leftIcon={<ArrowUp size={16} />}
                           style={transitionStyles}
                           onClick={() => scrollTo({ y: 0 })}
                        >
                           Scroll to top
                        </Button>
                        <Button
                           leftIcon={<ArrowRight size={16} />}
                           style={transitionStyles}
                           onClick={() => dispatch(getNextPage())}
                        >
                        Load next page
                     </Button>
                     </Group>
                  )}
            </Transition>
         </Affix>
      </Container>
      </>
   );
}