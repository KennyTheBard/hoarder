import { Spoiler, Text } from '@mantine/core';
import { ResourceBookmark } from 'common';


export function ResourceBookmarkCard(props: ResourceBookmark) {

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