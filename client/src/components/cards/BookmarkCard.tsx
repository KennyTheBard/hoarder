import { ActionIcon, Image, Card, Center, Group, Menu, Text, Stack, Box, Spoiler, MantineTheme, UnstyledButton, Tooltip } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { Archive, ArchiveOff, Edit, ExternalLink, Settings, Share, TrashX } from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ArticleBookmarkCard, VideoBookmarkCard, MovieBookmarkCard, ShowBookmarkCard, AnimeBookmarkCard, GameBookmarkCard, PlainTextBookmarkCard, ResourceBookmarkCard, ToolBookmarkCard, ComicsBookmarkCard, BookBookmarkCard, BoardGameBookmarkCard, UnknownBookmarkCard } from '.';
import { deleteBookmark, archiveBookmark, restoreBookmark } from '../../redux/slices';
import { DEFAULT_TAG_COLOR, DEFAULT_TAG_VARIANT, notify } from '../../utils';
import { TagBadge } from '../tag-badge';
import { AddBookmarkForm } from '../bookmark-form';
import { WithId, Bookmark, Tag, BookmarkType } from 'common';
import ReactTimeAgo from 'react-time-ago';


export interface BookmarkCardProps {
   bookmark: WithId<Bookmark>;
   tempTags?: Tag[];
   viewOnly?: boolean;
   onClick?: () => void;
}

export function BookmarkCard(props: BookmarkCardProps) {
   const bookmark = props.bookmark;

   const dispatch = useAppDispatch();
   const modals = useModals();

   const tagsMap = useAppSelector((state) => state.tags.tags);

   const getCardContentByBookmarkType = () => {
      switch (bookmark.type) {
         case BookmarkType.ARTICLE:
            return <ArticleBookmarkCard bookmark={bookmark} />
         case BookmarkType.TOOL:
            return <ToolBookmarkCard bookmark={bookmark} />
         case BookmarkType.COMICS:
            return <ComicsBookmarkCard bookmark={bookmark} />
         case BookmarkType.BOOK:
            return <BookBookmarkCard bookmark={bookmark} />
         case BookmarkType.VIDEO:
            return <VideoBookmarkCard bookmark={bookmark} />
         case BookmarkType.MOVIE:
            return <MovieBookmarkCard bookmark={bookmark} />
         case BookmarkType.SHOW:
            return <ShowBookmarkCard bookmark={bookmark} />
         case BookmarkType.ANIME:
            return <AnimeBookmarkCard bookmark={bookmark} />
         case BookmarkType.GAME:
            return <GameBookmarkCard bookmark={bookmark} />
         case BookmarkType.BOARDGAME:
            return <BoardGameBookmarkCard bookmark={bookmark} />
         case BookmarkType.PLAINTEXT:
            return <PlainTextBookmarkCard bookmark={bookmark} />
         case BookmarkType.RESOURCE:
            return <ResourceBookmarkCard bookmark={bookmark} />
         default:
            return <UnknownBookmarkCard bookmark={bookmark} />
      }
   }

   const getColorByBookmarkType = (theme: MantineTheme) => {
      switch (bookmark.type) {
         case BookmarkType.ARTICLE:
            return theme.colors.blue;
         case BookmarkType.TOOL:
            return theme.colors.teal;
         case BookmarkType.VIDEO:
            return theme.colors.red;
         case BookmarkType.MOVIE:
            return theme.colors.indigo;
         case BookmarkType.SHOW:
            return theme.colors.grape;
         case BookmarkType.ANIME:
            return theme.colors.pink;
         case BookmarkType.GAME:
            return theme.colors.green;
         case BookmarkType.PLAINTEXT:
            return theme.colors.yellow;
         case BookmarkType.RESOURCE:
            return theme.colors.dark;
         default:
            return theme.colors.grey;
      }
   }

   const onArchive = () => {
      dispatch(archiveBookmark(bookmark._id))
         .unwrap()
         .then(() => notify({
            message: `Bookmark '${bookmark.title}' has been archived successfully.`,
            title: 'Archived',
            icon: <Archive />,
            color: 'orange'
         }));
   }

   const onRestoreFromArchive = () => {
      dispatch(restoreBookmark(bookmark._id))
         .unwrap()
         .then(() => notify({
            message: `Bookmark '${bookmark.title}' has been restored successfully.`,
            title: 'Restored',
            icon: <ArchiveOff />,
            color: 'blue'
         }));
   }

   const onDelete = () =>
      modals.openConfirmModal({
         title: 'Archive bookmark',
         centered: true,
         children: (
            <Text size="sm">
               This action cannot be reverted and will result in data loss.
            </Text>
         ),
         labels: { confirm: 'Delete', cancel: 'Cancel' },
         confirmProps: { color: 'red' },
         onConfirm: () => dispatch(deleteBookmark(bookmark._id))
      });

   const onEdit = () => {
      modals.openModal({
         title: "Add bookmark",
         padding: "md",
         size: "xl",
         centered: true,
         children: (
            <AddBookmarkForm origin="edit_button" bookmark={bookmark} />
         )
      });
   }

   return (
      <Card
         shadow="sm"
         radius={3}
         p="0px"
         component="div"
         withBorder
         sx={(theme: MantineTheme) => ({
            border: '2px solid',
            borderColor: getColorByBookmarkType(theme)
         })}
      >
         <Box sx={(theme: MantineTheme) => ({
            backgroundColor: getColorByBookmarkType(theme)
         })}>
            <Group position="right" mr="10px">
               <Text color="white" weight="bold">
                  {bookmark.type}
               </Text>
            </Group>
         </Box>
         <Box
            p="20px"
            sx={(theme) => ({
               padding: theme.spacing.xs,
            })}
         >
            <Card.Section>
               <Center mb="15px">
                  {bookmark.url !== '' &&
                     <Image
                        onClick={() => window.open(bookmark.url)}
                        radius="md" fit="contain" width={260}
                        src={bookmark.imageUrl!}
                        alt=""
                        sx={() => ({
                           cursor: 'pointer'
                        })}
                     />
                  }
               </Center>

               <Stack mb="15px">
                  {getCardContentByBookmarkType()}
               </Stack>
            </Card.Section>

            <Spoiler maxHeight={27} showLabel="More" hideLabel="Less">
               <Group mb="15px" spacing="xs">
                  {bookmark.tags
                     .map((tagId: string) => tagsMap[tagId])
                     .map((tag: WithId<Tag>) =>
                        <TagBadge
                           key={tag._id}
                           name={tag.name}
                           variant={tag.variant ? tag.variant : DEFAULT_TAG_VARIANT}
                           color={tag.color ? tag.color : DEFAULT_TAG_COLOR}
                        />
                     )}
               </Group>
            </Spoiler>
            <Group position="apart">
               <ReactTimeAgo timeStyle="twitter" tooltip={false} date={new Date(bookmark.createdTimestamp)} />
               <Group position="right" spacing="xs">
                  {bookmark.url !== '' &&
                     <Tooltip label="Open URL">
                        <UnstyledButton
                           onClick={() => window.open(bookmark.url)}
                        >
                           <ActionIcon >
                              <ExternalLink />
                           </ActionIcon>
                        </UnstyledButton>
                     </Tooltip>
                  }
                  {!props.viewOnly &&
                     <Tooltip label="Settings">
                        <Menu position="right"
                           control={<ActionIcon><Settings /></ActionIcon>}>
                           <Menu.Item
                              disabled={true}
                              icon={<Share size={14} />}
                           >
                              Share
                           </Menu.Item>
                           <Menu.Item
                              icon={<Edit size={14} />}
                              onClick={onEdit}
                           >
                              Edit
                           </Menu.Item>
                           {bookmark.isArchived &&
                              <Menu.Item color="blue"
                                 icon={<ArchiveOff size={14} />}
                                 onClick={onRestoreFromArchive}
                              >
                                 Restore
                              </Menu.Item>
                           }
                           <Menu.Item color="red"
                              icon={bookmark.isArchived ? <TrashX size={14} /> : <Archive size={14} />}
                              onClick={bookmark.isArchived ? onDelete : onArchive}
                           >
                              {bookmark.isArchived ? 'Delete' : 'Archive'}
                           </Menu.Item>
                        </Menu>
                     </Tooltip>
                  }
               </Group>

            </Group>
         </Box>
      </Card>
   );
}