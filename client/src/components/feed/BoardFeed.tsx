import { Grid, Stack } from '@mantine/core';
import { Bookmark } from '../../models/bookmark';
import { BookmarkCard } from './BookmarkCard';


export interface BoardFeedProps {
   columnCount: number;
   entries: Array<Bookmark>;
}

export function BoardFeed(props: BoardFeedProps) {

   const entriesPerColumn: Bookmark[][] = Array.from(Array(props.columnCount).keys()).map(e => []);
   console.log(entriesPerColumn)
   props.entries.forEach((entry: Bookmark, index: number) => entriesPerColumn[index % props.columnCount].push(entry));

   return (
      <Grid columns={props.columnCount} justify="center">
         {entriesPerColumn.map(entries =>
            <Grid.Col span={1}>
               <Stack>
                  {entries.map(entry => <BookmarkCard bookmark={entry}/>)}
               </Stack>
            </Grid.Col>
         )}
      </Grid>
   );
}