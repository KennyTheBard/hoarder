import { Text } from '@mantine/core';
import { ComicsBookmark } from 'common';


export function ComicsBookmarkCard(props: ComicsBookmark) {

   return (
      <>
         <Text>
            {props.title}
         </Text>
      </>
   );
}