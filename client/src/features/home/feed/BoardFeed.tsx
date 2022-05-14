import { Grid, Stack } from '@mantine/core';
import { Bookmark } from '../../../models';
import { useAppSelector } from '../../../redux/hooks';
import { WithId } from '../../../utils';
import { BookmarkCard } from './BookmarkCard';


export interface BoardFeedProps {
   columnCount: number;
}

export function BoardFeed(props: BoardFeedProps) {

   const entriesPerColumn: WithId<Bookmark>[][] = Array.from(Array(props.columnCount).keys()).map(() => []);
   const bookmarks = useAppSelector((state) => state.bookmarkList.bookmarks);
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