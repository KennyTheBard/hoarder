import { Spoiler, Text } from '@mantine/core';
import { PlainTextBookmark } from 'common';


export function PlainTextBookmarkCard(props: PlainTextBookmark) {
   
   return (
      <>
         <Text>
            {props.title}
         </Text>
         <Spoiler maxHeight={120} showLabel="More" hideLabel="Less">
            <Text>
               {props.note}
            </Text>
         </Spoiler>
      </>
   );
}