import { Group, Text } from '@mantine/core';
import { VideoBookmark } from 'common';


export function VideoBookmarkCard(props: VideoBookmark) {

   const zeroPad = (value: number, places: number) => String(value).padStart(places, '0');

   const secondsToHumanFriendly = (seconds: number | undefined): string => seconds
      ? seconds >= 60 * 60
         ? `${Math.floor(seconds / (60 * 60))}:${zeroPad(Math.floor(seconds / 60) % 60, 2)}:${zeroPad(seconds % 60, 2)}`
         : `${Math.floor(seconds / 60)}:${zeroPad(seconds % 60, 2)}`
      : '';

   return (
      <>
         <Text>
            {props.title}
         </Text>
         <Group position="apart">
            <Text>
               {props.hostname}
            </Text>
            <Text>
               {secondsToHumanFriendly(props.durationInSeconds)}
            </Text>
         </Group>
      </>
   );
}