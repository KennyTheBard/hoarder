import { Button, Card, Group, Select, Space, Stack, TextInput } from '@mantine/core';
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';
import { Trash } from 'tabler-icons-react';
import { Metadata } from '../../models';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUrlMetadata, resetMetadata } from '../../redux/slices';
import { MetadataPreview, TagsSelect } from './utils';

export function AddBookmarkForm() {

   const [bookmarkType, setBookmarkType] = useState<string | null>(null);
   const [bookmarkTitle, setBookmarkTitle] = useState<string | null>(null);
   const [bookmarkUrl, setBookmarkUrl] = useState<string | null>(null);
   const [bookmarkTags, setBookmarkTags] = useState<string[]>([]);

   const metadata = useAppSelector((state) => state.addBookmark.metadata);
   const dispatch = useAppDispatch();

   const debouncedGetUrlMetadata = debounce((url: string | null) => {
      if (url === null) {
         return;
      }
      dispatch(getUrlMetadata(url))
         .unwrap()
         .then((data: Metadata | undefined) => {
            if (!data) {
               return;
            }
            setBookmarkTitle(data.title || bookmarkTitle);
         });
   }, 500);

   useEffect(() => debouncedGetUrlMetadata(bookmarkUrl), [bookmarkUrl]);
   const resetMetadataPreview = () => {
      dispatch(resetMetadata());
   }
   useEffect(resetMetadataPreview, []);

   const getTitleLabelByType = (): string | undefined => {
      switch (bookmarkType) {
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
      switch (bookmarkType) {
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
      switch (bookmarkType) {
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

   return (
      <>
         <Group direction="row" position="apart" spacing="xl" grow>
            <Stack align="center" justify="space-around" spacing="lg">
               <Select
                  label="What type of bookmark is this?"
                  placeholder="Pick one"
                  nothingFound="Nothing..."
                  searchable
                  maxDropdownHeight={400}
                  value={bookmarkType || null}
                  data={[
                     { value: 'article', label: 'Article' },
                     { value: 'tool', label: 'Tool' },
                     { value: 'video', label: 'Video' },
                     { value: 'movie', label: 'Movie' },
                     { value: 'show', label: 'Show' },
                     { value: 'anime', label: 'Anime' },
                     { value: 'game', label: 'Game' },
                  ]}
                  onChange={(type: string) => setBookmarkType(type)}
               />

               <TextInput
                  placeholder="https://..."
                  label={getUrlLabelByType() || 'URL'}
                  value={bookmarkUrl || ''}
                  required
                  disabled={bookmarkType === null}
                  onChange={(event) => setBookmarkUrl(event.target.value)}
               />

               <TextInput
                  label={getTitleLabelByType() || 'Title'}
                  value={bookmarkTitle || ''}
                  required
                  disabled={bookmarkType === null}
                  onChange={(event) => setBookmarkTitle(event.target.value)}
               />

               <TagsSelect disabled={bookmarkType === null} />
            </Stack>
            {metadata !== null &&
               <Card>
                  <MetadataPreview metadata={metadata} />

                  <Button
                     color="red"
                     leftIcon={<Trash />}
                     onClick={() => dispatch(resetMetadata())}
                  >
                     Drop metadata
                  </Button>
               </Card>
            }
         </Group>
         <Space h="lg" />
      </>
   );
}