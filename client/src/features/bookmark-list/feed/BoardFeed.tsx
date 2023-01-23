import { Center, Grid, Loader, Space } from '@mantine/core';
import { BookmarkCard } from '../../../components';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getNextPage } from '../../../redux/slices';
import { useMemo } from 'react';
import debounce from 'lodash.debounce';


export interface BoardFeedProps {
   columnCount: number;
}

export function BoardFeed(props: BoardFeedProps) {

   const dispatch = useAppDispatch();
   const bookmarks = useAppSelector((state) => state.bookmarkSlice.bookmarks);
   const bookmarksLoaded = useAppSelector((state) => state.bookmarkSlice.bookmarksLoaded);
   const bookmarksTotal = useAppSelector((state) => state.bookmarkSlice.bookmarksTotal);

   const debouncedLoadMoreBookmarks = useMemo(() =>
      debounce(() => {
         dispatch(getNextPage());
      }, 500, {
         leading: true,
         trailing: false
      }),
      [],
   );

   return (
      <Grid columns={props.columnCount} justify="center" mb="100px">
         {Array.from(Array(props.columnCount).keys()).map((_, columnIndex) => (
            <Grid.Col key={columnIndex} span={1}>
               <InfiniteScroll
                  dataLength={Math.floor(bookmarksLoaded / props.columnCount) + (columnIndex < bookmarksLoaded % props.columnCount ? 1 : 0)} //This is important field to render the next data
                  next={debouncedLoadMoreBookmarks}
                  hasMore={bookmarksLoaded < (bookmarksTotal ?? 0)}
                  scrollThreshold="200px"
                  loader={
                     <Center><Loader color="red" size="xl" variant="dots" /></Center>
                  }
               >
                  {Object.values(bookmarks)
                     .filter((_, entryIndex) => entryIndex % props.columnCount === columnIndex)
                     .map(entry => <>
                        <BookmarkCard key={entry.id} {...entry} />
                        <Space h="md" />
                     </>)
                  }
               </InfiniteScroll>
            </Grid.Col>
         ))}
      </Grid>
   );
}