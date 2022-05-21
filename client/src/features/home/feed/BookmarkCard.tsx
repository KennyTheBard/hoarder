import { ActionIcon, Badge, Image, Card, Center, Group, Menu, Space, Text, Stack, Box } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { Edit, Settings, Share, Trash } from 'tabler-icons-react';
import { Bookmark } from '../../../models/bookmark';
import { useAppDispatch } from '../../../redux/hooks';
import { deleteBookmark } from '../../../redux/slices/bookmarkListSlice';
import { WithId } from '../../../utils/with-id';
import { ArticleBookmarkCard, VideoBookmarkCard, MovieBookmarkCard, ShowBookmarkCard, AnimeBookmarkCard, GameBookmarkCard } from './cards';
import { UnknownBookmarkCard } from './cards/UnknownBookmarkCard';


export interface BookmarkCardProps {
   bookmark: WithId<Bookmark>;
   viewOnly?: boolean;
   onClick?: () => void;
}

export function BookmarkCard(props: BookmarkCardProps) {

   const dispatch = useAppDispatch();
   const modals = useModals();

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

   const openDeleteModal = () =>
      modals.openConfirmModal({
         title: 'Delete bookmark',
         centered: true,
         children: (
            <Text size="sm">
               This action is destructive and you will not be able to undo it!
            </Text>
         ),
         labels: { confirm: 'Delete', cancel: 'Cancel' },
         confirmProps: { color: 'red' },
         onConfirm: () => dispatch(deleteBookmark(props.bookmark._id))
      });

   return (
      <Card
         shadow="sm"
         radius={6}
         p="xl"
         component="div"
      >
         <Box
            sx={(theme) => ({
               padding: theme.spacing.xs,
            })}
         >
            <Card.Section>
               <Center>
                  {props.bookmark.imageUrl &&
                     <Image
                        radius="md" fit="contain" width={260}
                        src={props.bookmark.imageUrl!}
                        alt="Preview"
                     />
                  }
               </Center>
               <Stack>
                  <Space />
                  {getCardContentByBookmarkType()}
               </Stack>
            </Card.Section>

            <Group>
               {props.bookmark.tags
                  ? props.bookmark.tags.map((tag: string) => <Badge key={tag}>{tag}</Badge>)
                  : 'Missing tags'
               }
            </Group>
            <Group position="apart">
               <Text size="xs">
                  {props.bookmark.createdTimestamp
                     ? new Date(props.bookmark.createdTimestamp).toLocaleString('ro')
                     : ''
                  }
               </Text>
               {!props.viewOnly &&
                  <Menu position="right"
                     control={<ActionIcon><Settings /></ActionIcon>}>
                     <Menu.Item icon={<Share size={14} />}>Share</Menu.Item>
                     <Menu.Item icon={<Edit size={14} />}>Edit</Menu.Item>
                     <Menu.Item color="red"
                        icon={<Trash size={14} />}
                        onClick={openDeleteModal}
                     >
                        Delete
                     </Menu.Item>
                  </Menu>
               }
            </Group>
         </Box>
      </Card>
   );
}