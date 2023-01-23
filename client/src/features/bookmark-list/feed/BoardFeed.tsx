import { Grid, Stack } from '@mantine/core';
import { Bookmark, WithId } from 'common';
import { BookmarkCard } from '../../../components';
import { useAppSelector } from '../../../redux/hooks';


export interface BoardFeedProps {
   columnCount: number;
}

export function BoardFeed(props: BoardFeedProps) {

   const entriesPerColumn: WithId<Bookmark>[][] = Array.from(Array(props.columnCount).keys()).map(() => []);
   const bookmarks = useAppSelector((state) => state.bookmarkSlice.bookmarks);
   bookmarks.forEach((entry: WithId<Bookmark>, index: number) => entriesPerColumn[index % props.columnCount].push(entry));

   return (
      <Grid columns={props.columnCount} justify="center" mb="100px">
         {entriesPerColumn.map((entries, idx) =>
            <Grid.Col key={idx} span={1}>
               <Stack>
                  {entries.map(entry => <BookmarkCard key={entry.id} {...entry}/>)}
               </Stack>
            </Grid.Col>
         )}
      </Grid>
   );
}