import { Text } from '@mantine/core';
import { ComicsBookmark } from 'common';

export interface ComicsBookmarkCardProps {
   bookmark: ComicsBookmark;
}

export function ComicsBookmarkCard(props: ComicsBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <>
         <Text>
            {bookmark.title}
         </Text>
      </>
   );
}