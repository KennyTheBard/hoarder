import { ActionIcon, Badge, Image, Card, Center, Group, Menu, Space, Text, Stack, Box, Spoiler } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { Archive, Edit, Settings, Share, Trash } from 'tabler-icons-react';
import { Bookmark, BookmarkType } from '../../models/bookmark';
import { useAppDispatch } from '../../redux/hooks';
import { WithId } from '../../utils/support-types';
import { ArticleBookmarkCard, VideoBookmarkCard, MovieBookmarkCard, ShowBookmarkCard, AnimeBookmarkCard, GameBookmarkCard } from '.';
import { UnknownBookmarkCard } from './UnknownBookmarkCard';
import { updateIsArchivedForBookmark } from '../../redux/slices';


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
               type: BookmarkType.ARTICLE,
            }} />
         case 'tool':
            // TODO: Add a ToolBookmarkCard
            return <></>
         case 'video':
            return <VideoBookmarkCard bookmark={{
               ...props.bookmark,
               type: BookmarkType.VIDEO,
            }} />
         case 'movie':
            return <MovieBookmarkCard bookmark={{
               ...props.bookmark,
               type: BookmarkType.MOVIE,
            }} />
         case 'show':
            return <ShowBookmarkCard bookmark={{
               ...props.bookmark,
               type: BookmarkType.SHOW,
            }} />
         case 'anime':
            return <AnimeBookmarkCard bookmark={{
               ...props.bookmark,
               type: BookmarkType.ANIME,
            }} />
         case 'game':
            return <GameBookmarkCard bookmark={{
               ...props.bookmark,
               type: BookmarkType.GAME,
            }} />
         default:
            return <UnknownBookmarkCard bookmark={props.bookmark} />
      }
   }

   const openDeleteModal = () =>
      modals.openConfirmModal({
         title: 'Archive bookmark',
         centered: true,
         children: (
            <Text size="sm">
               If you wish to undo this action, you will have to do it manually from the "Archived" section.
            </Text>
         ),
         labels: { confirm: 'Archive', cancel: 'Cancel' },
         confirmProps: { color: 'red' },
         onConfirm: () => dispatch(updateIsArchivedForBookmark({
            bookmarkId: props.bookmark._id,
            isArchived: true
         }))
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
               <Center mb="15px">
                  {props.bookmark.imageUrl &&
                     <Image
                        radius="md" fit="contain" width={260}
                        src={props.bookmark.imageUrl!}
                        alt="Preview"
                     />
                  }
               </Center>
               <Stack mb="15px">
                  {getCardContentByBookmarkType()}
               </Stack>
            </Card.Section>

            <Spoiler maxHeight={22} showLabel="More" hideLabel="Less">
               <Group mb="15px" spacing="xs">
                  {props.bookmark.tags.map((tag: string) => <Badge key={tag}>{tag}</Badge>)}
               </Group>
            </Spoiler>
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
                        icon={<Archive size={14} />}
                        onClick={openDeleteModal}
                     >
                        Archive
                     </Menu.Item>
                  </Menu>
               }
            </Group>
         </Box>
      </Card>
   );
}