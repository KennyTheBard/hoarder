import { Text } from '@mantine/core';
import { BookBookmark } from 'common';


export function BookBookmarkCard(props: BookBookmark) {

   return (
      <>
         <Text>
            {props.title}
         </Text>
         {props.subtitle &&
            <Text>
               {props.subtitle}
            </Text>
         }
         {props.authors && props.authors.length > 0 &&
            <Text>
               by {props.authors[0]}
            </Text>
         }
      </>
   );
}