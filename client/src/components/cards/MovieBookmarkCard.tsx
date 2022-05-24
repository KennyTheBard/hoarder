import { ActionIcon, Anchor, Card, Center, Group, Space, Stack, Text } from '@mantine/core';
import { BrandNetflix } from 'tabler-icons-react';
import { MovieBookmark } from '../../models/bookmark';

export interface MovieBookmarkCardProps {
   bookmark: MovieBookmark
}

export function MovieBookmarkCard(props: MovieBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <>
         <Text>
            {bookmark.title} ({bookmark.releaseYear})
         </Text>
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