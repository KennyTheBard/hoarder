import { Button, Card, Group, LoadingOverlay, ScrollArea, Select, SelectItem, Space, Stack, TextInput } from '@mantine/core';
import { useModals } from '@mantine/modals';
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';
import { Pin } from 'tabler-icons-react';
import { BookmarkCard } from '../../features/home/feed';
import { BookmarkTypeSuggestion, GameDuration, Metadata, BookmarkTypeMetadata, Bookmark } from '../../models';
import { useAppDispatch } from '../../redux/hooks';
import { getBookmarks, getGameMetadataCandidates, getTypeSuggestions, getUrlMetadata, saveBookmark } from '../../redux/slices';
import { BOOKMARK_TYPE_OPTIONS, isValidHttpUrl, notifyError, WithId } from '../../utils';
import { TagsSelect } from './utils';

export type AddBookmarkFormProps = {
   pinnedText: string;
}

export function AddBookmarkForm(props: AddBookmarkFormProps) {

   const dispatch = useAppDispatch();
   const modals = useModals();

   const [bookmarkType, setBookmarkType] = useState<string>('');
   const [bookmarkTitle, setBookmarkTitle] = useState<string>(!isValidHttpUrl(props.pinnedText) ? props.pinnedText : '');
   const [bookmarkUrl, setBookmarkUrl] = useState<string>(isValidHttpUrl(props.pinnedText) ? props.pinnedText : '');
   const [bookmarkTags, setBookmarkTags] = useState<string[]>([]);
   const [errors, setErrors] = useState<Record<string, string | null>>({});
   const [isSubmitLoading, setSubmitLoading] = useState(false);
   const [isMetadataLoading, setMetadataLoading] = useState(false);
   const [gameDuration, setGameDuration] = useState<GameDuration | null>(null);
   const [metadata, setMetadata] = useState<Metadata | null>(null);
   const [typeSuggestions, setTypeSuggestions] = useState<BookmarkTypeSuggestion[]>([]);
   const [candidates, setCandidates] = useState<BookmarkTypeMetadata[] | null>(null);
   const [selectedCandidate, setSelectedCandidate] = useState<BookmarkTypeMetadata | null>(null);
   const [bookmarkData, setBookmarkData] = useState<WithId<Bookmark> | null>()

   // TODO: move in utils
   const getTypeOptions = (suggestions: BookmarkTypeSuggestion[]): SelectItem[] => {
      const suggestionDictionary: Record<string, number> = {};
      suggestions.forEach((suggestion) => suggestionDictionary[suggestion.type] = suggestion.confidence);

      const options = [
         ...BOOKMARK_TYPE_OPTIONS
      ];

      options.sort((option1, option2) => (suggestionDictionary[option2.value] || 0) - (suggestionDictionary[option1.value] || 0));
      return options;
   }

   const debouncedDispatchOnUrlChange = debounce((url: string) => {
      setMetadataLoading(true);
      dispatch(getUrlMetadata(url))
         .unwrap()
         .then((data: Metadata | undefined) => {
            if (!data) {
               return;
            }
            setBookmarkTitle(data.title || bookmarkTitle);
            setMetadata(data || null);
            setMetadataLoading(false);
         });

      dispatch(getTypeSuggestions(bookmarkUrl))
         .unwrap()
         .then((data: BookmarkTypeSuggestion[]) => setTypeSuggestions(data));
   }, 500);
   const debouncedDispatchOnTitleChange = debounce((gameTitle: string) => {
      switch (bookmarkType) {
         case 'game':
            dispatch(getGameMetadataCandidates({ type: bookmarkType, gameTitle }))
               .unwrap()
               .then((data: BookmarkTypeMetadata[] | null) => {
                  setCandidates(data);
               });
      }
   }, 500);

   // useEffect(() => setMetadata(null), []);
   useEffect(() => {
      if (bookmarkUrl.length === 0) {
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
      debouncedDispatchOnUrlChange(bookmarkUrl);
   }, [bookmarkUrl]);
   useEffect(() => {
      if (bookmarkTitle.length === 0) {
         return;
      }
      debouncedDispatchOnTitleChange(bookmarkTitle);
   }, [bookmarkTitle]);
   useEffect(() => {
      setBookmarkData(
         bookmarkType
            ? {
               _id: '',
               createdTimestamp: 0,
               updatedTimestamp: 0,
               type: bookmarkType,
               title: bookmarkTitle,
               url: bookmarkUrl,
               tags: bookmarkTags,
               imageUrl: metadata !== null && metadata.image !== null ? metadata.image : undefined,
               hostname: metadata !== null && metadata.hostname !== null ? metadata.hostname : undefined,
               ...selectedCandidate
            } as WithId<Bookmark>
            : null
         )
   }, [bookmarkTitle, bookmarkUrl, bookmarkType, bookmarkTags, metadata]);

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
         dispatch(saveBookmark(payload))
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
                  data={getTypeOptions(typeSuggestions)}
                  onChange={(type: string) => setBookmarkType(type)}
                  error={errors.type}
               />

               <TextInput
                  placeholder="https://..."
                  label={getUrlLabelByType() || 'URL'}
                  value={bookmarkUrl || ''}
                  required
                  onChange={(event) => setBookmarkUrl(event.target.value)}
                  error={errors.url}
               />

               <TextInput
                  label={getTitleLabelByType() || 'Title'}
                  value={bookmarkTitle || ''}
                  required
                  onChange={(event) => setBookmarkTitle(event.target.value)}
                  error={errors.title}
               />

               <TagsSelect
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
               {bookmarkData &&
                  <BookmarkCard bookmark={bookmarkData} viewOnly={true} />
                  // <Stack>
                  //    <MetadataPreview metadata={metadata} />

                  //    <Button
                  //       color="red"
                  //       leftIcon={<Trash />}
                  //       onClick={() => setMetadata(null)}
                  //    >
                  //       Drop metadata
                  //    </Button>
                  // </Stack>
               }
            </Card>
         </Group>
         <Space h="lg" />
         {candidates && candidates.length > 0 &&
            <ScrollArea style={{ height: 400 }}>
               <Group position="center">
                  {/* {candidates.map((candidate: GameDurationCandidate) => (
                     <GameDurationCandidateCard
                        key={candidate.title}
                        candidate={candidate}
                        onClick={() => setGameDuration(candidate.duration)}
                     />
                  ))} */}
               </Group>
            </ScrollArea>
         }
         <Space h="lg" />
      </>
   );
}