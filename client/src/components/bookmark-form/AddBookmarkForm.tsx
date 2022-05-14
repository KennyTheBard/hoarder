import { Button, Card, Center, Group, LoadingOverlay, Select, Space, Stack, TextInput } from '@mantine/core';
import { useModals } from '@mantine/modals';
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';
import { Pin, Trash } from 'tabler-icons-react';
import { Metadata } from '../../models';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addBookmark, getBookmarks, getUrlMetadata, resetMetadata } from '../../redux/slices';
import { isValidHttpUrl, notifyError } from '../../utils';
import { MetadataPreview, TagsSelect } from './utils';

export function AddBookmarkForm() {

   const [bookmarkType, setBookmarkType] = useState<string | null>(null);
   const [bookmarkTitle, setBookmarkTitle] = useState<string | null>(null);
   const [bookmarkUrl, setBookmarkUrl] = useState<string | null>(null);
   const [bookmarkTags, setBookmarkTags] = useState<string[]>([]);
   const [errors, setErrors] = useState<Record<string, string | null>>({});
   const [isSubmitLoading, setSubmitLoading] = useState(false);
   const [isMetadataLoading, setMetadataLoading] = useState(false);

   const metadata = useAppSelector((state) => state.addBookmark.metadata);
   const dispatch = useAppDispatch();
   const modals = useModals();

   const debouncedGetUrlMetadata = debounce((url: string) => {
      setMetadataLoading(true);
      dispatch(getUrlMetadata(url))
         .unwrap()
         .then((data: Metadata | undefined) => {
            if (!data) {
               return;
            }
            setBookmarkTitle(data.title || bookmarkTitle);
            setMetadataLoading(false);
         });
   }, 500);
   const resetMetadataPreview = () => {
      dispatch(resetMetadata());
   }

   useEffect(() => {
      if (bookmarkUrl === null || bookmarkUrl.length === 0) {
         return;
      }
      if (!isValidHttpUrl(bookmarkUrl)) {
         setErrors({
            ...errors,
            url: 'Invalid URL'
         })
         return;
      }
      setErrors({
         ...errors,
         url: null
      })
      debouncedGetUrlMetadata(bookmarkUrl)
   }, [bookmarkUrl]);
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

   const onBookmarkSubmit = async () => {
      setSubmitLoading(true);

      const errors = {
         type: bookmarkType === null || bookmarkType === '' ? 'Type is mandatory' : null,
         title: bookmarkTitle === null || bookmarkTitle === '' ? 'Title is mandatory' : null,
         url: bookmarkUrl === null || bookmarkUrl === '' ? 'URL is mandatory' : null,
         tags: bookmarkTags.length === 0 ? 'Provide at minimum 1 tag' : null,
      };
      console.log(errors);
      setErrors(errors);
      const ok = Object.values(errors).filter(v => v !== null).length === 0;

      if (ok) {
         const payload = {
            type: bookmarkType!,
            title: bookmarkTitle!,
            url: bookmarkUrl!,
            tags: bookmarkTags,
            imageUrl: (metadata && metadata.image) ? metadata.image : undefined,
         };
         dispatch(addBookmark(payload))
            .unwrap()
            .then((response) => {
               setSubmitLoading(false);
               if (response.success) {
                  dispatch(getBookmarks());
                  modals.closeAll();
               } else {
                  notifyError(response.error);
               }
            });
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
                  error={errors.type}
               />

               <TextInput
                  placeholder="https://..."
                  label={getUrlLabelByType() || 'URL'}
                  value={bookmarkUrl || ''}
                  required
                  disabled={bookmarkType === null}
                  onChange={(event) => setBookmarkUrl(event.target.value)}
                  error={errors.url}
               />

               <TextInput
                  label={getTitleLabelByType() || 'Title'}
                  value={bookmarkTitle || ''}
                  required
                  disabled={bookmarkType === null}
                  onChange={(event) => setBookmarkTitle(event.target.value)}
                  error={errors.title}
               />

               <TagsSelect
                  disabled={bookmarkType === null}
                  error={errors.tags}
                  onChange={(tags: string[]) => setBookmarkTags(tags)}
               />

               <Button
                  color="green"
                  disabled={bookmarkType === null}
                  loading={isSubmitLoading}
                  leftIcon={<Pin size={14} />}
                  onClick={onBookmarkSubmit}
               >
                  Save
               </Button>
            </Stack>
            <Card>
               <LoadingOverlay visible={isMetadataLoading} />
               {metadata &&
                  <Stack>
                     <MetadataPreview metadata={metadata} />

                     <Button
                        color="red"
                        leftIcon={<Trash />}
                        onClick={() => dispatch(resetMetadata())}
                     >
                        Drop metadata
                     </Button>
                  </Stack>
               }
            </Card>
         </Group>
         <Space h="lg" />
      </>
   );
}