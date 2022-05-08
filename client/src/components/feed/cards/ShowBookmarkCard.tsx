import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { ActionIcon, Anchor, Card, Center, Group, Space, Stack, Text } from '@mantine/core';
import { BrandNetflix, Checks } from 'tabler-icons-react';
import { ShowBookmark } from '../../../models/bookmark';

export interface ShowBookmarkCardProps {
   bookmark: ShowBookmark
}

export function ShowBookmarkCard(props: ShowBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <Card.Section>
         {bookmark.url &&
            <Center>
               <LinkPreview url={bookmark.url} imageHeight={150} width={300} descriptionLength={35} />
            </Center>
         }
         <Stack>
            <Space />
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
         </Stack>
      </Card.Section >
   );
}