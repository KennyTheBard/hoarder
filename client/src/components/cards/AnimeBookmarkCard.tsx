import { ActionIcon, Anchor, Group, Text } from '@mantine/core';
import { BrandNetflix } from 'tabler-icons-react';
import { AnimeBookmark } from 'common';


export function AnimeBookmarkCard(props: AnimeBookmark) {

   return (
      <>
         <Group position="apart">
            <Text>
               {props.title} {props.releaseYear && `(${props.releaseYear})`}
            </Text>
         </Group>
         <Group position="apart">
            <Anchor href={props.url} target="_blank">
               {props.myAnimeListScore && `${props.myAnimeListScore.toFixed(1)} on`} MyAnimeList
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