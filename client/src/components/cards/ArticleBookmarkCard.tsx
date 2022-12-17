import { Text } from '@mantine/core';
import { ArticleBookmark } from 'common';


export function ArticleBookmarkCard(props: ArticleBookmark) {

   return (
      <>
         <Text>
            {props.title}
         </Text>
      </>
   );
}