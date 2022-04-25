import { Grid, Stack } from '@mantine/core';
import { ReactNode } from 'react';
import { WebResource } from '../models/resource';
import { ResourceCard } from './ResourceCard';


export interface BoardFeedProps {
   columnCount: number;
   entries: Array<WebResource>;
}

export function BoardFeed(props: BoardFeedProps) {

   const entriesPerColumn: WebResource[][] = Array.from(Array(props.columnCount).keys()).map(e => []);
   console.log(entriesPerColumn)
   props.entries.forEach((entry: WebResource, index: number) => entriesPerColumn[index % props.columnCount].push(entry));

   return (
      <Grid columns={props.columnCount} justify="center">
         {entriesPerColumn.map(entries =>
            <Grid.Col span={1}>
               <Stack>
                  {entries.map(entry => <ResourceCard resource={entry}/>)}
               </Stack>
            </Grid.Col>
         )}
      </Grid>
   );
}