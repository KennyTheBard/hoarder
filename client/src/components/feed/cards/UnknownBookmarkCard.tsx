import { Alert, Card } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { AlertCircle } from 'tabler-icons-react';
import { Bookmark } from '../../../models/bookmark';


export interface UnknownBookmarkCardProps {
   bookmark: Bookmark
}

export function UnknownBookmarkCard(props: UnknownBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <Card.Section>
         <Alert icon={<AlertCircle size={16} />} title="Bummer!" color="red">
            Incorrect bookmark formating!
            <Prism language="json">{JSON.stringify(bookmark, null, 2)}</Prism>
         </Alert>
      </Card.Section>
   );
}