import { Text } from '@mantine/core';
import { ToolBookmark } from 'common';

export interface ToolBookmarkCardProps {
   bookmark: ToolBookmark;
}

export function ToolBookmarkCard(props: ToolBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <>
         <Text>
            {bookmark.title}
         </Text>
      </>
   );
}