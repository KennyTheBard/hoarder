import { ActionIcon, Anchor, Group, Text } from '@mantine/core';
import { BrandNetflix } from 'tabler-icons-react';
import { MovieBookmark } from 'common';


export function MovieBookmarkCard(props: MovieBookmark) {

   return (
      <>
         <Text>
            {props.title} ({props.releaseYear})
         </Text>
         <Group position="apart">
            <Group>
               <Anchor href={props.url} target="_blank">
                  {props.imdbRating && `${props.imdbRating.toFixed(1)} on`} IMDB
               </Anchor>
            </Group>
            {props.isOnNetflix &&
               <ActionIcon variant="transparent">
                  <BrandNetflix />
               </ActionIcon>
            }
         </Group>
      </>
   );
}