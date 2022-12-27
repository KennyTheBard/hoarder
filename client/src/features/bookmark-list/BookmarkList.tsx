import { Affix, Button, Center, Checkbox, Container, Group, Input, Loader, Mark, MultiSelect, SegmentedControl, Space, Stack, Text, Transition } from '@mantine/core';
import { Refresh, Search, ArrowUp, ArrowRight } from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getBookmarks, getNextPage, getAllTags, setSearchTermAndUpdate, setShowArchived, setTypesAndUpdate, setTagsAndUpdate, setTagsOperatorAndUpdate } from '../../redux/slices';
import { ChangeEvent, useEffect } from 'react';
import { BoardFeed } from './feed';
import { getTypeOptions } from '../../utils';
import { BookmarkType, FilterOperator, Id, Tag, WithId } from 'common';
import { useElementSize, useViewportSize, useWindowScroll } from '@mantine/hooks';

export function BookmarkList() {

   const dispatch = useAppDispatch();
   const [scroll, scrollTo] = useWindowScroll();
   const { ref, height: elementHeight } = useElementSize();
   const { height: viewportHeight } = useViewportSize();

   const bookmarks = useAppSelector((state) => state.bookmarkList.bookmarks);
   const tags = useAppSelector((state) => state.tags.tags);
   const bookmarkTotal = useAppSelector((state) => state.bookmarkList.bookmarksTotal);
   const loading = useAppSelector((state) => state.bookmarkList.loading);
   const searchForm = useAppSelector((state) => state.bookmarkList.searchForm);

   const refreshData = () => {
      dispatch(getBookmarks());
      dispatch(getAllTags());
   };
   useEffect(refreshData, [searchForm]);

   return (
      <>
         <Container size="xl" ref={ref}>
            <Stack mt="20px">
               {!!bookmarkTotal &&
                  <Stack mb="10px">
                     <Center>
                        <Text fw={700} size="lg">
                           Loaded <Mark color="blue">{bookmarks.length}</Mark> out of <Mark color="grape">{bookmarkTotal}</Mark> bookmarks
                        </Text>
                     </Center>
                  </Stack>
               }
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
                        placeholder="Types..."
                        maxDropdownHeight={500}
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
               <Center>
                  <Group position="apart">
                     <SegmentedControl
                        data={[
                           FilterOperator.OR,
                           FilterOperator.AND
                        ]}
                        defaultValue={FilterOperator.OR}
                        onChange={(op: FilterOperator) => dispatch(setTagsOperatorAndUpdate(op))}
                     />
                     <MultiSelect
                        data={Object.values(tags).map((tag: WithId<Tag>) => ({
                           value: tag.id,
                           label: tag.name
                        }))}
                        searchable
                        placeholder="Tags..."
                        maxDropdownHeight={500}
                        clearable
                        onChange={(tags: Id[]) => dispatch(setTagsAndUpdate(tags))}
                        sx={{ width: 350 }}
                     />
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