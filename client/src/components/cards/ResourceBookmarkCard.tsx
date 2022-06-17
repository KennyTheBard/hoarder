import { Spoiler, Text } from '@mantine/core';
import { ResourceBookmark } from 'common';


export interface ResourceBookmarkCardProps {
   bookmark: ResourceBookmark;
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