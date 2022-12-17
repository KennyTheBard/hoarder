import { ActionIcon, Anchor, Group, Text } from '@mantine/core';
import { Checks, BrandNetflix } from 'tabler-icons-react';
import { AnimeBookmark } from 'common';


export function AnimeBookmarkCard(props: AnimeBookmark) {

   return (
      <>
         <Group position="apart">
            <Text>
               {props.title} ({props.releaseYear}
               {props.isFinished && ` - ${props.finishedYear}`})
            </Text>
            {props.isFinished &&
               <ActionIcon variant="transparent">
                  <Checks />
               </ActionIcon>
            }
         </Group>
         <Group position="apart">
            <Anchor href={props.url} target="_blank">
               {props.myAnimeListScore} ({props.myAnimeListReviewCount}) on MyAnimeList
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