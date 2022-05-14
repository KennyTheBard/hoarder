import { Group, Text } from '@mantine/core';
import { VideoBookmark } from '../../../../models/bookmark';

export interface VideoBookmarkCardProps {
   bookmark: VideoBookmark
}

export function VideoBookmarkCard(props: VideoBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <>
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
      </>
   );
}