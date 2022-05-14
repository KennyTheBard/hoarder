import { ActionIcon, Anchor, Group, Text } from '@mantine/core';
import { BrandNetflix, Checks } from 'tabler-icons-react';
import { ShowBookmark } from '../../../models/bookmark';

export interface ShowBookmarkCardProps {
   bookmark: ShowBookmark
}

export function ShowBookmarkCard(props: ShowBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <>
         <Group position="apart">
            <Text>
               {bookmark.title} ({bookmark.premieredYear}
               {bookmark.isFinished && ` - ${bookmark.finishedYear}`})
            </Text>
            {bookmark.isFinished &&
               <ActionIcon variant="transparent">
                  <Checks />
               </ActionIcon>
            }
         </Group>
         <Group position="apart">
            <Anchor href={bookmark.url} target="_blank">
               {bookmark.imdbRating} on IMDB
            </Anchor>
            {bookmark.isOnNetflix &&
               <ActionIcon variant="transparent">
                  <BrandNetflix />
               </ActionIcon>
            }
         </Group>
      </>
   );
}