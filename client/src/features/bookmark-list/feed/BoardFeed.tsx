import { Grid, Stack } from '@mantine/core';
import { BookmarkCard } from '../../../components';
import { Bookmark } from '../../../models';
import { WithId } from '../../../utils';


export interface BoardFeedProps {
   bookmarks: WithId<Bookmark>[];
   columnCount: number;
}

export function BoardFeed(props: BoardFeedProps) {

   const entriesPerColumn: WithId<Bookmark>[][] = Array.from(Array(props.columnCount).keys()).map(() => []);
   const bookmarks = props.bookmarks;
   bookmarks.forEach((entry: WithId<Bookmark>, index: number) => entriesPerColumn[index % props.columnCount].push(entry));

   return (
      <Grid columns={props.columnCount} justify="center">
         {entriesPerColumn.map((entries, idx) =>
            <Grid.Col key={idx} span={1}>
               <Stack>
                  {entries.map(entry => <BookmarkCard key={entry._id} bookmark={entry}/>)}
               </Stack>
            </Grid.Col>
         )}
      </Grid>
   );
}