import { ActionIcon, Anchor, Group, Text } from '@mantine/core';
import { BrandNetflix, Checks } from 'tabler-icons-react';
import { ShowBookmark } from 'common';


export function ShowBookmarkCard(props: ShowBookmark) {

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
               {props.imdbRating && `${props.imdbRating.toFixed(1)} on`} IMDB
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