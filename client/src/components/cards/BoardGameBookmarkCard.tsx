import { Text } from '@mantine/core';
import { BoardGameBookmark } from 'common';

export interface BoardGameBookmarkCardProps {
   bookmark: BoardGameBookmark;
}

export function BoardGameBookmarkCard(props: BoardGameBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <>
         <Text>
            {bookmark.title}
         </Text>
      </>
   );
}