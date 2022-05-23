import { ActionIcon, Anchor, Group, Text } from '@mantine/core';
import { Checks, BrandNetflix } from 'tabler-icons-react';
import { AnimeBookmark } from '../../models/bookmark';

export interface AnimeBookmarkCardProps {
   bookmark: AnimeBookmark
}

export function AnimeBookmarkCard(props: AnimeBookmarkCardProps) {
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
               {bookmark.myAnimeListScore} ({bookmark.myAnimeListReviewCount}) on MyAnimeList
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