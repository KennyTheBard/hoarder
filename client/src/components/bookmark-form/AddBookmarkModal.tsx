import { Box, Button, Card, Container, Group, Modal, Select, Space, Stack, TextInput } from '@mantine/core';
import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';
import { Trash } from 'tabler-icons-react';
import { Bookmark, Metadata } from '../../models';
import { useAppDispatch } from '../../redux/hooks';
import { getUrlMetadata } from '../../redux/slices';
import { MetadataPreview } from './utils';
import { TagsSelect } from './utils/TagsSelect';

export interface AddBookmarkModalProps {
   opened: boolean;
   onClose: () => void;
}

export function AddBookmarkModal(props: AddBookmarkModalProps) {

   const [bookmark, setBookmark] = useState<Partial<Bookmark>>({});

   const [metadata, setMetadata] = useState<Metadata | null>(null);
   const dispatch = useAppDispatch();

   const getTitleLabelByType = (): string | undefined => {
      switch (bookmark.type) {
         case 'game':
         case 'tool':
            return 'Name'
         case 'movie':
         case 'show':
         case 'anime':
            return 'International name'
         default:
            return undefined;
      }
   }

   const getUrlLabelByType = (): string | undefined => {
      switch (bookmark.type) {
         case 'tool':
            return 'Website or repository URL'
         case 'show':
         case 'movie':
            return 'IMDB URL'
         case 'anime':
            return 'MyAnimeList URL'
         case 'game':
            return 'Store page or website URL'
         default:
            return undefined;
      }
   }

   const getActionOnTitleUpdateByType = () => {
      switch (bookmark.type) {
         case 'article':
         case 'video':
         case 'tool':
         case 'show':
         case 'movie':
         case 'anime':
         case 'game':
         default:
            return undefined;
      }
   }

   const onUrlChange = debounce((url: string) => {
      dispatch(getUrlMetadata(url))
         .unwrap()
         .then((data: Metadata | undefined) => {
            if (!data) {
               return;
            }
            setBookmark({
               ...bookmark,
               title: data.title || bookmark.title,
               imageUrl: data.image || bookmark.imageUrl
            });
            setMetadata(data);
         });
   }, 500);

   const onTitleChange = debounce((title: string) => console.log(title), 500);

   return (
      <Modal
         opened={props.opened}
         onClose={() => {
            props.onClose();
            setTimeout(() => setBookmark({}), 300);
         }}
         title="Add bookmark"
         padding="md"
         size={metadata === null ? "md" : "xl"}
         centered
      >
         <Group direction="row" position="apart" spacing="xl" grow>
            <Stack align="center" justify="space-around" spacing="lg">
               <Select
                  label="What type of bookmark is this?"
                  placeholder="Pick one"
                  nothingFound="Nothing..."
                  searchable
                  maxDropdownHeight={400}
                  value={bookmark.type || null}
                  data={[
                     { value: 'article', label: 'Article' },
                     { value: 'tool', label: 'Tool' },
                     { value: 'video', label: 'Video' },
                     { value: 'movie', label: 'Movie' },
                     { value: 'show', label: 'Show' },
                     { value: 'anime', label: 'Anime' },
                     { value: 'game', label: 'Game' },
                  ]}
                  onChange={(value: 'article' | 'tool' | 'video' | 'movie' | 'show' | 'anime' | 'game' | null) => setBookmark({
                     ...bookmark,
                     type: value || undefined
                  })}
               />

               <TextInput
                  placeholder="https://..."
                  label={getUrlLabelByType() || 'URL'}
                  value={bookmark.url}
                  required
                  disabled={bookmark.type === undefined}
                  onChange={(event) => {
                     setBookmark({
                        ...bookmark,
                        url: event.target.value
                     });
                     onUrlChange(event.currentTarget.value);
                  }}
               />

               <TextInput
                  label={getTitleLabelByType() || 'Title'}
                  value={bookmark.title}
                  required
                  disabled={bookmark.type === undefined}
                  onChange={(event) => {
                     setBookmark({
                        ...bookmark,
                        title: event.target.value
                     });
                     onTitleChange(event.currentTarget.value)
                  }}
               />

               <TagsSelect disabled={bookmark.type === undefined} />
            </Stack>
            {metadata !== null &&
               <Card>
                  <MetadataPreview metadata={metadata} />

                  <Button
                  color="red"
                  leftIcon={<Trash />}
                  onClick={() => setMetadata(null)}
                  >
                     Drop metadata
                  </Button>
               </Card>
            }
         </Group>

         <Space h="lg" />
      </Modal >
   );
}