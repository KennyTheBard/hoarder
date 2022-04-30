import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { ActionIcon, Anchor, Card, Center, Group, Space, Stack, Text } from '@mantine/core';
import { BrandNetflix } from 'tabler-icons-react';
import { MovieBookmark } from '../../../models/bookmark';

export interface MovieBookmarkCardProps {
   bookmark: MovieBookmark
}

export function MovieBookmarkCard(props: MovieBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <Card.Section>
         {bookmark.imdbUrl &&
            <Center>
               <LinkPreview url={bookmark.imdbUrl} imageHeight={150} width={300} descriptionLength={35} />
            </Center>
         }
         <Stack>
            <Space />
            <Text>
               {bookmark.title} ({bookmark.premieredYear})
            </Text>
            <Group position="apart">
               <Anchor href={bookmark.imdbUrl} target="_blank">
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