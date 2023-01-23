import { Grid, Stack } from '@mantine/core';
import { BookmarkCard } from '../../../components';
import { useAppSelector } from '../../../redux/hooks';


export interface BoardFeedProps {
   columnCount: number;
}

export function BoardFeed(props: BoardFeedProps) {

   const bookmarks = useAppSelector((state) => state.bookmarkSlice.bookmarks);

   return (
      <Grid columns={props.columnCount} justify="center" mb="100px">
         {Array.from(Array(props.columnCount).keys()).map((_, columnIndex) => (
            <Grid.Col key={columnIndex} span={1}>
               <Stack>
                  {bookmarks
                     .filter((_, entryIndex) => entryIndex % props.columnCount === columnIndex)
                     .map(entry => <BookmarkCard key={entry.id} {...entry} />)
                  }
               </Stack>
            </Grid.Col>
         ))}
      </Grid>
   );
}