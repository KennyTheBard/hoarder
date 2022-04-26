import { Badge, Button, Card, Center, Group, Space, Text } from '@mantine/core';
import { useState } from 'react';
import { Edit, TrashX } from 'tabler-icons-react';
import { Bookmark } from '../models/bookmark';
import { ArticleBookmarkCardContent } from './card-contents/ArticleBookmarkCardContent';


export interface BookmarkCardProps {
   bookmark: Bookmark
}

export function BookmarkCard(props: BookmarkCardProps) {

   const [expanded, setExpanded] = useState<boolean>(false);

   const getCardContentByBookmarkType = () => {
      switch (props.bookmark.type) {
         case 'article':
            return <ArticleBookmarkCardContent bookmark={props.bookmark}/>
         default: 
            return <></>
      }
   }

   return (
      <Card
         shadow="sm"
         radius={6}
         p="xl"
         component="a"
         onMouseEnter={() => setExpanded(true)}
         onMouseLeave={() => setExpanded(false)}
      >
         <Space />
            {getCardContentByBookmarkType()}
         <Space h="lg" />
         <Group>
            {props.bookmark.tags.map(tag => <Badge>{tag}</Badge>)}
         </Group>
         <Space h="md" />
         <Text size="xs">
            {new Date(props.bookmark.createdTimestamp).toLocaleString('ro')}
         </Text>

         {expanded &&
            <>
               <Space h="md" />
               <Group>
                  <Button size="xs" leftIcon={<Edit size={14} />}>
                     Edit
                  </Button>
                  <Button size="xs" leftIcon={<TrashX size={14} />} color="red">
                     Delete
                  </Button>
               </Group>
            </>
         }
      </Card>
   );
}