import { Affix, Button, Center, Checkbox, Container, Group, Input, Mark, MultiSelect, SegmentedControl, Select, Space, Stack, Text, Transition } from '@mantine/core';
import { Refresh, Search, ArrowUp, Dice3 } from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ChangeEvent, useEffect, useMemo } from 'react';
import { BoardFeed } from './feed';
import { getTypeOptions } from '../../utils';
import { BookmarkType, FilterOperator, Id, Tag, WithId } from 'common';
import { useWindowScroll } from '@mantine/hooks';
import { getBookmarks, getRandomBookmark, setSearchTermAndUpdate, setSortingAndUpdate, setTagsAndUpdate, setTagsOperatorAndUpdate, setTypesAndUpdate } from '../../redux/thunks';
import { getAllTags, setShowArchived, searchParamsToBookmarkSearchForm, bookmarkSearchFormToSearchParams, setSearchForm, SortingType } from '../../redux/slices';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash.debounce';

export function BookmarkList() {

   const dispatch = useAppDispatch();
   const [scroll, scrollTo] = useWindowScroll();
   const [searchParams, setSearchParams] = useSearchParams();

   const tags = useAppSelector((state) => state.tagSlice.tagMaps);
   const bookmarksLoaded = useAppSelector((state) => state.bookmarkSlice.bookmarksLoaded);
   const bookmarkTotal = useAppSelector((state) => state.bookmarkSlice.bookmarksTotal);
   const searchForm = useAppSelector((state) => state.bookmarkSlice.searchForm);

   const debouncedRefreshData = useMemo(() =>
      debounce(() => {
         dispatch(getBookmarks());
         dispatch(getAllTags());
      }, 500),
      []
   );
   const debouncedRandom = useMemo(() =>
      debounce(() => {
         if (!bookmarkTotal) {
            return;
         }
         dispatch(getRandomBookmark(Math.floor(Math.random() * bookmarkTotal)));
      }, 500),
      [bookmarkTotal]
   );
   const debouncedSearchTermUpdate = useMemo(() =>
      debounce((searchTerm: string) => {
         dispatch(setSearchTermAndUpdate(searchTerm))
      }, 500),
      []
   );
   useEffect(() => {
      dispatch(setSearchForm(searchParamsToBookmarkSearchForm(searchParams)));
   }, []);
   useEffect(() => {
      debouncedRefreshData();
      setSearchParams(bookmarkSearchFormToSearchParams(searchForm));
   }, [searchForm]);

   return (
      <>
         <Container size="xl">
            <Stack mt="20px">
               {!!bookmarkTotal &&
                  <Stack mb="10px">
                     <Center>
                        <Text fw={700} size="lg">
                           Loaded <Mark color="blue">{bookmarksLoaded}</Mark> out of <Mark color="grape">{bookmarkTotal}</Mark> bookmarks
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
                        onChange={(event: ChangeEvent<HTMLInputElement>) => debouncedSearchTermUpdate(event.target.value)}
                     />
                     <MultiSelect
                        data={getTypeOptions()}
                        value={searchForm.types}
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
                        onClick={debouncedRefreshData}
                     >
                        Refresh
                     </Button>
                     <Button
                        leftIcon={<Dice3 size={16} />}
                        onClick={debouncedRandom}
                     >
                        Random
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
                        value={searchForm.tagsOperator}
                        defaultValue={FilterOperator.OR}
                        onChange={(op: FilterOperator) => dispatch(setTagsOperatorAndUpdate(op))}
                     />
                     <MultiSelect
                        data={Object.values(tags).map((tag: WithId<Tag>) => ({
                           value: tag.id,
                           label: tag.name
                        }))}
                        value={searchForm.tags}
                        searchable
                        placeholder="Tags..."
                        maxDropdownHeight={500}
                        clearable
                        onChange={(tags: Id[]) => dispatch(setTagsAndUpdate(tags))}
                        sx={{ width: 350 }}
                     />
                     <Select
                        placeholder="Order by..."
                        defaultValue={SortingType.RANDOM}
                        maxDropdownHeight={500}
                        sx={{ width: 350 }}
                        data={[
                           { value: SortingType.RANDOM, label: 'Random' },
                           { value: SortingType.CREATED_ASC, label: 'Oldest created to newest' },
                           { value: SortingType.CREATED_DESC, label: 'Newest created to oldest' },
                           { value: SortingType.MODIFIED_ASC, label: 'Oldest modified to newest' },
                           { value: SortingType.MODIFIED_DESC, label: 'Newest modified to oldest' },
                           ...(searchForm.types && searchForm.types.length === 1 && searchForm.types[0] === BookmarkType.VIDEO
                                 ? [
                                    { value: SortingType.DURATION_ASC, label: 'Shortest to longest (Video only)' },
                                    { value: SortingType.DURATION_DESC, label: 'Longest to shortes (Video only)' },
                                 ]
                                 : [])
                        ]}
                        onChange={(value: SortingType) => dispatch(setSortingAndUpdate(value))}
                     />
                  </Group>
               </Center>
               <Space h={20} />

               {bookmarksLoaded > 0
                  ? <BoardFeed columnCount={4} />
                  : <Center>
                     <Text size="xl" color="grey" weight="lighter" ml="20px">No bookmarks found</Text>
                  </Center>
               }
            </Stack>
            <Affix position={{ bottom: 20, left: 20 }}>
               <Transition transition="slide-up" mounted={scroll.y > 50}>
                  {(transitionStyles) => (
                     <Group>
                        <Button
                           leftIcon={<ArrowUp size={16} />}
                           style={transitionStyles}
                           onClick={() => scrollTo({ y: 0 })}
                        >
                           Scroll to top
                        </Button>
                     </Group>
                  )}
               </Transition>
            </Affix>
         </Container>
      </>
   );
}