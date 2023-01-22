import { Affix, Button, Center, Checkbox, Container, Group, Input, Loader, Mark, MultiSelect, SegmentedControl, Space, Stack, Text, Transition } from '@mantine/core';
import { Refresh, Search, ArrowUp, ArrowRight, Dice3 } from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ChangeEvent, useEffect, useMemo } from 'react';
import { BoardFeed } from './feed';
import { getTypeOptions } from '../../utils';
import { BookmarkType, FilterOperator, Id, Tag, WithId } from 'common';
import { useElementSize, useViewportSize, useWindowScroll } from '@mantine/hooks';
import { getBookmarks, getRandomBookmark, setSearchTermAndUpdate, setTagsAndUpdate, setTagsOperatorAndUpdate, setTypesAndUpdate } from '../../redux/thunks';
import { getAllTags, setShowArchived, getNextPage, searchParamsToBookmarkSearchForm, bookmarkSearchFormToSearchParams, setSearchForm } from '../../redux/slices';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash.debounce';

export function BookmarkList() {

   const dispatch = useAppDispatch();
   const [scroll, scrollTo] = useWindowScroll();
   const { ref, height: elementHeight } = useElementSize();
   const { height: viewportHeight } = useViewportSize();
   const [searchParams, setSearchParams] = useSearchParams();

   const bookmarks = useAppSelector((state) => state.bookmarkSlice.bookmarks);
   const tags = useAppSelector((state) => state.tagSlice.tagMaps);
   const bookmarkTotal = useAppSelector((state) => state.bookmarkSlice.bookmarksTotal);
   const loading = useAppSelector((state) => state.bookmarkSlice.loading);
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