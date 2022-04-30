import { Card, Text } from '@mantine/core';
import { PlainTextBookmark } from '../../../models/bookmark';

export interface PlainTextBookmarkCardProps {
   bookmark: PlainTextBookmark
}

export function PlainTextBookmarkCard(props: PlainTextBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <Card.Section>
         <Text>
            {bookmark.content}
         </Text>
      </Card.Section>
   );
}