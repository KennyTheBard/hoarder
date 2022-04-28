import { Badge, Button, Card, Center, Group, Space, Text } from '@mantine/core';
import { useState } from 'react';
import { Edit, TrashX } from 'tabler-icons-react';
import { Bookmark } from '../models/bookmark';
import { ArticleBookmarkCard, PlainTextBookmarkCard, VideoBookmarkCard, MovieBookmarkCard, ShowBookmarkCard, AnimeBookmarkCard, GameBookmarkCard } from './cards';


export interface BookmarkCardProps {
   bookmark: Bookmark
}

export function BookmarkCard(props: BookmarkCardProps) {

   const [expanded, setExpanded] = useState<boolean>(false);

   const getCardContentByBookmarkType = () => {
      switch (props.bookmark.type) {
         case 'article':
            return <ArticleBookmarkCard bookmark={props.bookmark} />
         case 'text':
            return <PlainTextBookmarkCard bookmark={props.bookmark} />
         case 'video':
            return <VideoBookmarkCard bookmark={props.bookmark} />
         case 'movie':
            return <MovieBookmarkCard bookmark={props.bookmark} />
         case 'show':
            return <ShowBookmarkCard bookmark={props.bookmark} />
         case 'anime':
            return <AnimeBookmarkCard bookmark={props.bookmark} />
         case 'game':
            return <GameBookmarkCard bookmark={props.bookmark} />
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