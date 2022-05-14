import { Text, Center } from '@mantine/core';
import { ArticleBookmark } from '../../../../models/bookmark';

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