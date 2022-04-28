import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { Card, Center, Group, Space, Stack, Text } from '@mantine/core';
import { VideoBookmark } from '../../models/bookmark';

export interface VideoBookmarkCardProps {
   bookmark: VideoBookmark
}

export function VideoBookmarkCard(props: VideoBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <Card.Section>
         <Center>
            <LinkPreview url={bookmark.url} imageHeight={150} width={300} descriptionLength={35} />
         </Center>
         <Stack>
            <Space />
            <Text>
               {bookmark.title}
            </Text>
            <Group position="apart">
               <Text>
                  {bookmark.hostname}
               </Text>
               <Text>
                  {bookmark.lengthInSeconds} seconds
               </Text>
            </Group>
         </Stack>
      </Card.Section>
   );
}