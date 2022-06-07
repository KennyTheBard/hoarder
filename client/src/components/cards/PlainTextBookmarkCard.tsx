import { Spoiler, Text } from '@mantine/core';
import { Bookmark } from '../../models/bookmark';


export interface PlainTextBookmarkCardProps {
   bookmark: Bookmark
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