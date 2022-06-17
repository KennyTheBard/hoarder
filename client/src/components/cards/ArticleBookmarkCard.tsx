import { Text } from '@mantine/core';
import { ArticleBookmark } from 'common';

export interface ArticleBookmarkCardProps {
   bookmark: ArticleBookmark
}

export function ArticleBookmarkCard(props: ArticleBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <>
         <Text>
            {bookmark.title}
         </Text>
      </>
   );
}