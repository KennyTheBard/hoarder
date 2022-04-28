import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { ActionIcon, Anchor, Card, Center, Group, Space, Stack, Text } from '@mantine/core';
import { Checks, BrandNetflix } from 'tabler-icons-react';
import { AnimeBookmark } from '../../models/bookmark';

export interface AnimeBookmarkCardProps {
   bookmark: AnimeBookmark
}

export function AnimeBookmarkCard(props: AnimeBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <Card.Section>
         {bookmark.posterUrl &&
            <Center>
               <LinkPreview url={bookmark.posterUrl} imageHeight={150} width={300} descriptionLength={35} />
            </Center>
         }
         <Stack>
            <Space />
            <Group position="apart">
               <Text>
                  {bookmark.title} ({bookmark.premieredYear}
                  {bookmark.finished && ` - ${bookmark.finishedYear}`})
               </Text>
               {bookmark.finished &&
                  <ActionIcon variant="transparent">
                     <Checks />
                  </ActionIcon>
               }
            </Group>
            <Group position="apart">
               <Anchor href={bookmark.myAnimeListUrl} target="_blank">
                  {bookmark.myAnimeListScore} ({bookmark.myAnimeListReviewCount}) on MyAnimeList
               </Anchor>
               {bookmark.isOnNetflix &&
                  <ActionIcon variant="transparent">
                     <BrandNetflix />
                  </ActionIcon>
               }
            </Group>
         </Stack>
      </Card.Section >
   );
}