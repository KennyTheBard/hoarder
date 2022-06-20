import { Text } from '@mantine/core';
import { BookBookmark } from 'common';

export interface BookBookmarkCardProps {
   bookmark: BookBookmark
}

export function BookBookmarkCard(props: BookBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <>
         <Text>
            {bookmark.title}
         </Text>
         {bookmark.subtitle &&
            <Text>
               {bookmark.subtitle}
            </Text>
         }
         {bookmark.authors && bookmark.authors.length > 0 &&
            <Text>
               by {bookmark.authors[0]}
            </Text>
         }
      </>
   );
}