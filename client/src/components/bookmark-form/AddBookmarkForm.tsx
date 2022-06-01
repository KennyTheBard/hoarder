import { Button, Card, Group, LoadingOverlay, Select, SimpleGrid, Space, Stack, TextInput } from '@mantine/core';
import { useModals } from '@mantine/modals';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import { Pin } from 'tabler-icons-react';
import { BookmarkTypeSuggestion, Metadata, BookmarkTypeMetadata, Bookmark } from '../../models';
import { useAppDispatch } from '../../redux/hooks';
import { getBookmarks, getMetadataCandidates, getTypeSuggestions, getUrlMetadata, getVideoDurationInSeconds, saveBookmark } from '../../redux/slices';
import { getTypeOptions, isValidHttpUrl, notifyError, WithId } from '../../utils';
import { BookmarkCard } from '../cards';
import { TagsSelect } from './utils';

export type AddBookmarkFormProps = {
   pinnedText: string;
}

export function AddBookmarkForm(props: AddBookmarkFormProps) {

   const dispatch = useAppDispatch();
   const modals = useModals();

   const [type, setType] = useState<string>('');
   const [title, setTitle] = useState<string>(!isValidHttpUrl(props.pinnedText) ? props.pinnedText : '');
   const [url, setUrl] = useState<string>(isValidHttpUrl(props.pinnedText) ? props.pinnedText : '');
   const [tags, setTags] = useState<string[]>([]);
   const [imageUrl, setImageUrl] = useState<string>('');
   const [errors, setErrors] = useState<Record<string, string | null>>({});
   const [isSubmitLoading, setSubmitLoading] = useState(false);
   const [isMetadataLoading, setMetadataLoading] = useState(false);
   const [metadata, setMetadata] = useState<Metadata | null>(null);
   const [typeSuggestions, setTypeSuggestions] = useState<BookmarkTypeSuggestion[]>([]);
   const [candidates, setCandidates] = useState<BookmarkTypeMetadata[] | null>(null);
   const [selectedCandidate, setSelectedCandidate] = useState<BookmarkTypeMetadata | null>(null);
   const [bookmarkData, setBookmarkData] = useState<(WithId<Bookmark> & { [key: string]: any }) | null>(null)


   const debouncedGetUrlMetadata = useCallback(
      debounce((url: string) => {
         setMetadataLoading(true);
         dispatch(getUrlMetadata(url))
            .unwrap()
            .then((data: Metadata | undefined) => {
               if (!data) {
                  return;
               }
               setTitle(data.title || title);
               setImageUrl(data.image || title);
               setMetadata(data || null);
               setMetadataLoading(false);
            });
      }, 500),
      [url]
   );
   const debouncedGetTypeSuggestions = useCallback(
      debounce((url: string) => {
         dispatch(getTypeSuggestions(url))
            .unwrap()
            .then((data: BookmarkTypeSuggestion[]) => setTypeSuggestions(data));
      }, 500),
      [url]
   );
   const debouncedGetMetadataCandidates = useCallback(
      debounce((title: string) => {
         console.log(type);
         dispatch(getMetadataCandidates({ type, title }))
            .unwrap()
            .then((data: BookmarkTypeMetadata[] | null) => {
               setCandidates(data);
            });
      }, 500),
      [title, type]
   );
   const metadataToBookmark = (
      type: string,
      title: string,
      url: string,
      imageUrl: string,
      tags: string[],
      metadata: Metadata | null,
      candidate: BookmarkTypeMetadata = {}
   ) => {
      return {
         _id: '',
         createdTimestamp: 0,
         updatedTimestamp: 0,
         type,
         title,
         url,
         imageUrl,
         tags,
         hostname: metadata !== null && metadata.hostname !== null ? metadata.hostname : undefined,
         ...candidate,
      } as WithId<Bookmark>;
   }

   useEffect(() => {
      if (url.length === 0) {
         return;
      }
      if (!isValidHttpUrl(url)) {
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
      debouncedGetUrlMetadata(url);
      debouncedGetTypeSuggestions(url);
   }, [url]);
   useEffect(() => {
      if (title.length === 0 || type.length === 0) {
         return;
      }
      debouncedGetMetadataCandidates(title);
   }, [title, type]);
   useEffect(() => {
      if (bookmarkData === null) {
         return;
      }

      if (type !== 'video' || url.length === 0 || !isValidHttpUrl(url)) {
         setBookmarkData({
            ...bookmarkData,
            durationInSeconds: undefined
         });
         return;
      }

      dispatch(getVideoDurationInSeconds(url))
         .unwrap()
         .then((durationInSeconds: number) => {
            if (durationInSeconds === bookmarkData.durationInSeconds) {
               return;
            }
            
            setBookmarkData({
               ...bookmarkData,
               durationInSeconds
            })
         });
   }, [type, url, bookmarkData])
   useEffect(() => {
      setBookmarkData(
         type
            ? metadataToBookmark(
               type,
               title,
               url,
               imageUrl,
               tags,
               metadata,
               selectedCandidate ? selectedCandidate : undefined
            )
            : null
      )
   }, [type, title, url, imageUrl, tags, metadata, selectedCandidate]);
   useEffect(() => {
      const guaranteeTypes = typeSuggestions.filter(suggestion => suggestion.confidence === 1);
      if (guaranteeTypes.length > 0) {
         setType(guaranteeTypes[0].type);
      }
   }, [typeSuggestions]);
   useEffect(() => {
      if (selectedCandidate === null) {
         return;
      }
      if (title.length == 0) {
         setTitle(selectedCandidate.title ? selectedCandidate.title : '');
      }
      if (url.length === 0) {
         setUrl(selectedCandidate.url ? selectedCandidate.url : '');
      }
      if (imageUrl.length === 0) {
         setImageUrl(selectedCandidate.imageUrl ? selectedCandidate.imageUrl : '');
      }
   }, [selectedCandidate]);

   const getTitleLabelByType = (): string | undefined => {
      switch (type) {
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
      switch (type) {
         case 'tool':
            return 'Website or repository URL'
         case 'show':
         case 'movie':
            return 'IMDB URL'
         case 'anime':
            return 'MyAnimeList URL'
         case 'game':
            return 'Store page or website URL'
         case 'video':
            return 'Youtube URL'
         default:
            return undefined;
      }
   }

   const validateBookmarkData = (): Record<string, string | null> | null => {
      if (bookmarkData === null) {
         return null;
      }

      return {
         type: bookmarkData.type === '' ? 'Type is mandatory' : null,
         title: bookmarkData.title === '' ? 'Title is mandatory' : null,
         url: bookmarkData.url === '' ? 'URL is mandatory' : null,
         tags: bookmarkData.tags.length === 0 ? 'Provide at minimum 1 tag' : null,
      };
   }

   const onBookmarkSubmit = async () => {
      setSubmitLoading(true);

      const errors = validateBookmarkData();
      if (errors === null) {
         notifyError('Bookmark data is empty!');
         return;
      }

      const ok = Object.values(errors).filter(v => v !== null).length === 0;
      setErrors(errors);

      validateBookmarkData();

      if (ok) {
         dispatch(saveBookmark(bookmarkData!))
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
                  value={type || null}
                  data={getTypeOptions(typeSuggestions)}
                  onChange={(type: string) => setType(type)}
                  error={errors.type}
               />

               <TextInput
                  placeholder="https://..."
                  label={getUrlLabelByType() || 'URL'}
                  value={url || ''}
                  required
                  onChange={(event) => setUrl(event.target.value)}
                  error={errors.url}
               />

               <TextInput
                  label={getTitleLabelByType() || 'Title'}
                  value={title || ''}
                  required
                  onChange={(event) => setTitle(event.target.value)}
                  error={errors.title}
               />

               <TagsSelect
                  error={errors.tags}
                  onChange={(tags: string[]) => setTags(tags)}
               />

               <Button
                  color="green"
                  disabled={type === null}
                  loading={isSubmitLoading}
                  leftIcon={<Pin size={14} />}
                  onClick={onBookmarkSubmit}
               >
                  Save
               </Button>
            </Stack>
            <Card>
               <LoadingOverlay visible={isMetadataLoading} />
               {bookmarkData &&
                  <BookmarkCard bookmark={bookmarkData} viewOnly={true} />
               }
            </Card>
         </Group>
         <Space h="lg" />
         {!selectedCandidate && candidates && candidates.length > 0 &&
            <SimpleGrid cols={2}>
               {candidates.map((candidate: BookmarkTypeMetadata) => (
                  <Stack key={candidate.url}>
                     <BookmarkCard
                        bookmark={metadataToBookmark(
                           type,
                           title,
                           url,
                           candidate.imageUrl ? candidate.imageUrl : '',
                           tags,
                           metadata,
                           candidate
                        )}
                        viewOnly={true}
                     />
                     <Button
                        onClick={() => setSelectedCandidate(candidate)}
                     >
                        Use this one!
                     </Button>
                  </Stack>
               ))}
            </SimpleGrid>
         }
         <Space h="lg" />
      </>
   );
}