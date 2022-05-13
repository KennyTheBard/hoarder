import { ActionIcon, Badge, Button, Card, Center, Group, Menu, Space, Text } from '@mantine/core';
import { Edit, Settings, Share, Trash, TrashX } from 'tabler-icons-react';
import { Bookmark } from '../../models/bookmark';
import { useAppDispatch } from '../../redux/hooks';
import { deleteBookmark } from '../../redux/slices/bookmarkListSlice';
import { WithId } from '../../utils/with-id';
import { ArticleBookmarkCard, VideoBookmarkCard, MovieBookmarkCard, ShowBookmarkCard, AnimeBookmarkCard, GameBookmarkCard } from './cards';
import { UnknownBookmarkCard } from './cards/UnknownBookmarkCard';


export interface BookmarkCardProps {
   bookmark: WithId<Bookmark>;
}

export function BookmarkCard(props: BookmarkCardProps) {

   const dispatch = useAppDispatch();

   const getCardContentByBookmarkType = () => {
      switch (props.bookmark.type) {
         case 'article':
            return <ArticleBookmarkCard bookmark={{
               ...props.bookmark,
               type: 'article',
            }} />
         case 'tool':
            return <></>
         case 'video':
            return <VideoBookmarkCard bookmark={{
               ...props.bookmark,
               type: 'video',
            }} />
         case 'movie':
            return <MovieBookmarkCard bookmark={{
               ...props.bookmark,
               type: 'movie',
            }} />
         case 'show':
            return <ShowBookmarkCard bookmark={{
               ...props.bookmark,
               type: 'show',
            }} />
         case 'anime':
            return <AnimeBookmarkCard bookmark={{
               ...props.bookmark,
               type: 'anime',
            }} />
         case 'game':
            return <GameBookmarkCard bookmark={{
               ...props.bookmark,
               type: 'game',
            }} />
         default:
            return <UnknownBookmarkCard bookmark={props.bookmark} />
      }
   }

   return (
      <Card
         shadow="sm"
         radius={6}
         p="xl"
         component="div"
      >
         <Space />
         {getCardContentByBookmarkType()}
         <Space h="lg" />
         <Group>
            {props.bookmark.tags 
               ? props.bookmark.tags.map((tag: string) => <Badge key={tag}>{tag}</Badge>)
               : 'Missing tags'
            }
         </Group>
         <Space h="md" />
         <Group position="apart">
            <Text size="xs">
               {props.bookmark.createdTimestamp
                  ? new Date(props.bookmark.createdTimestamp).toLocaleString('ro')
                  : 'Missing creation date'
               }
            </Text>
            <Menu position="right"
               control={<ActionIcon><Settings /></ActionIcon>}>
               <Menu.Item icon={<Share size={14} />}>Share</Menu.Item>
               <Menu.Item icon={<Edit size={14} />}>Edit</Menu.Item>
               <Menu.Item color="red"
                  icon={<Trash size={14} />}
                  onClick={() => dispatch(deleteBookmark(props.bookmark._id))}
               >
                  Delete
               </Menu.Item>
            </Menu>
         </Group>
      </Card>
   );
}