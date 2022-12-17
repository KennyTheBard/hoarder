import { Text } from '@mantine/core';
import { ToolBookmark } from 'common';


export function ToolBookmarkCard(props: ToolBookmark) {

   return (
      <>
         <Text>
            {props.title}
         </Text>
      </>
   );
}