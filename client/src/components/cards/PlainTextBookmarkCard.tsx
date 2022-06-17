import { Spoiler, Text } from '@mantine/core';
import { PlainTextBookmark } from 'common';


export interface PlainTextBookmarkCardProps {
   bookmark: PlainTextBookmark
}

export function PlainTextBookmarkCard(props: PlainTextBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <>
         <Text>
            {bookmark.title}
         </Text>
         <Spoiler maxHeight={120} showLabel="More" hideLabel="Less">
            <Text>
               {bookmark.note}
            </Text>
         </Spoiler>
      </>
   );
}