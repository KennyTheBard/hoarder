import { Alert, Button, Collapse, Kbd, Stack, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { useState } from 'react';
import { AlertCircle } from 'tabler-icons-react';
import { Bookmark } from '../../models/bookmark';


export interface UnknownBookmarkCardProps {
   bookmark: Bookmark
}

export function UnknownBookmarkCard(props: UnknownBookmarkCardProps) {
   const bookmark = props.bookmark;

   const [showMore, setShowMore] = useState(false);

   return (
      <Alert icon={<AlertCircle size={16} />} title="Bummer!" color="red" mb="15px">
         <Stack>
            <Text>
               {bookmark.type === ''
                  ? <>No type provided!</>
                  : <>Unknown bookmark type <Kbd>{bookmark.type}</Kbd>!</>
               }
            </Text>
            <Button onClick={() => setShowMore(!showMore)}>
               See more
            </Button>
            <Collapse in={showMore} transitionDuration={400} transitionTimingFunction="ease">
               <Prism language="json">{JSON.stringify(bookmark, null, 2)}</Prism>
            </Collapse>
         </Stack>
      </Alert>
   );
}