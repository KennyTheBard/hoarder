import { Group, Text } from '@mantine/core';
import { VideoBookmark } from 'common';

export interface VideoBookmarkCardProps {
   bookmark: VideoBookmark
}

export function VideoBookmarkCard(props: VideoBookmarkCardProps) {
   const bookmark = props.bookmark;

   const zeroPad = (value: number, places: number) => String(value).padStart(places, '0');

   const secondsToHumanFriendly = (seconds: number | undefined): string => seconds
      ? seconds >= 60 * 60
         ? `${Math.floor(seconds / (60 * 60))}:${zeroPad(Math.floor(seconds / 60), 2)}:${zeroPad(seconds % 60, 2)}`
         : `${Math.floor(seconds / 60)}:${zeroPad(seconds % 60, 2)}`
      : '';

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
               {secondsToHumanFriendly(bookmark.durationInSeconds)}
            </Text>
         </Group>
      </>
   );
}