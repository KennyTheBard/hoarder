import { ActionIcon, Badge, Button, Card, Center, Group, Menu, Space, Text } from '@mantine/core';
import { useState } from 'react';
import { Edit, Settings, Share, Trash, TrashX } from 'tabler-icons-react';
import { Bookmark } from '../models/bookmark';
import { ArticleBookmarkCard, PlainTextBookmarkCard, VideoBookmarkCard, MovieBookmarkCard, ShowBookmarkCard, AnimeBookmarkCard, GameBookmarkCard } from './cards';


export interface BookmarkCardProps {
   bookmark: Bookmark
}

export function BookmarkCard(props: BookmarkCardProps) {

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
      >
         <Space />
         {getCardContentByBookmarkType()}
         <Space h="lg" />
         <Group>
            {props.bookmark.tags.map(tag => <Badge>{tag}</Badge>)}
         </Group>
         <Space h="md" />
         <Group position="apart">
            <Text size="xs">
               {new Date(props.bookmark.createdTimestamp).toLocaleString('ro')}
            </Text>
            <Menu position="right"
               control={<ActionIcon><Settings/></ActionIcon>}>
               <Menu.Item icon={<Share size={14} />}>Share</Menu.Item>
               <Menu.Item icon={<Edit size={14} />}>Edit</Menu.Item>
               <Menu.Item color="red" icon={<Trash size={14} />}>Delete</Menu.Item>
            </Menu>
         </Group>
      </Card>
   );
}