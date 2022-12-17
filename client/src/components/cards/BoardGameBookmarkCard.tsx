import { Text } from '@mantine/core';
import { BoardGameBookmark } from 'common';


export function BoardGameBookmarkCard(props: BoardGameBookmark) {

   return (
      <>
         <Text>
            {props.title}
         </Text>
      </>
   );
}