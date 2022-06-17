import { Alert, Kbd, Spoiler, Stack, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { AlertCircle } from 'tabler-icons-react';
import { Bookmark } from 'common';

export interface UnknownBookmarkCardProps {
   bookmark: Bookmark
}

export function UnknownBookmarkCard(props: UnknownBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <Alert icon={<AlertCircle size={16} />} title="Bummer!" color="red" mb="15px">
         <Stack>
            <Text>
               {bookmark.type === ''
                  ? <>No type provided!</>
                  : <>Unknown bookmark type <Kbd>{bookmark.type}</Kbd>!</>
               }
            </Text>
            <Spoiler maxHeight={80} showLabel="More" hideLabel="Less" transitionDuration={400}>
               <Prism language="json">{JSON.stringify(bookmark, null, 2)}</Prism>
            </Spoiler>
         </Stack>
      </Alert>
   );
}