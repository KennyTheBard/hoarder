import { Spoiler, Text } from '@mantine/core';
import { Bookmark } from '../../models/bookmark';


export interface ResourceBookmarkCardProps {
   bookmark: Bookmark
}

export function ResourceBookmarkCard(props: ResourceBookmarkCardProps) {
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