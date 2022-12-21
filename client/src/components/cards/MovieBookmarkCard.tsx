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
            <Anchor href={props.url} target="_blank">
               {props.imdbRating} on IMDB
            </Anchor>
            {props.isOnNetflix &&
               <ActionIcon variant="transparent">
                  <BrandNetflix />
               </ActionIcon>
            }
         </Group>
      </>
   );
}