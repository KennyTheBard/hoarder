import { ActionIcon, Button, Card, Group, LoadingOverlay, Select, SimpleGrid, Space, Stack, Textarea, Tooltip } from '@mantine/core';
import { useModals } from '@mantine/modals';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Pin, DiscountCheck } from 'tabler-icons-react';
import { Bookmark, WithId, BookmarkType, isValidHttpUrl, BookmarkTypeSuggestion, CandidateMetadata, Metadata, Id, findHttpUrls } from 'common';
import { useAppDispatch } from '../../redux/hooks';
import { notifyError, getTypeOptions } from '../../utils';
import { BookmarkCard } from '../cards';
import { TagsSelect } from './utils';
import { getUrlMetadata, getTypeSuggestions, getMetadataCandidates, getVideoDurationInSeconds, isUrlAlreadyBookmarked, updateBookmark, saveBookmark } from '../../redux/slices';
import { getBookmarks } from '../../redux/thunks';

export type AddBookmarkFormProps = {
   origin: 'pin_dialog';
   pinnedText: string;
} | {
   origin: 'import_tool';
   bookmark: Partial<Bookmark>;
   onCompleted?: () => void;
} | {
   origin: 'edit_button';
   bookmark: WithId<Bookmark>;
} | {
   origin: 'process_message';
   messageText: string;
   onCompleted?: () => void;
}

type BookmarkFormdata = {
   type: BookmarkType;
   title: string;
   note: string;
   url: string;
   imageUrl: string;
   tags: Id[];
   [key: string]: any;
};

function getInputOverrides(props: AddBookmarkFormProps): Partial<BookmarkFormdata> {
   const ret: Partial<BookmarkFormdata> = {};

   if (props.origin === 'pin_dialog') {
      ret[isValidHttpUrl(props.pinnedText) ? 'url' : 'title'] = props.pinnedText;
   }

   if (props.origin === 'import_tool') {
      for (const key of Object.keys(props.bookmark)) {
         ret[key] = props.bookmark[key as keyof Partial<Bookmark>];
      }
   }

   if (props.origin === 'edit_button') {
      for (const key of Object.keys(props.bookmark)) {
         ret[key] = props.bookmark[key as keyof WithId<Bookmark>];
      }
   }

   if (props.origin === 'process_message') {
      const matches = findHttpUrls(props.messageText);

      if (matches.length !== 1) {
         ret[props.messageText.length < 300 ? 'title' : 'note'] = props.messageText;
         return ret;
      }

      const onlyMatch = matches[0];
      ret['url'] = onlyMatch.text;
      const messageWithoutUrl = props.messageText.slice(0, onlyMatch.index) + props.messageText.slice(onlyMatch.index + onlyMatch.text.length);
      ret[messageWithoutUrl.length < 300 ? 'title' : 'note'] = messageWithoutUrl;
   }

   return ret;
}

export function AddBookmarkForm(props: AddBookmarkFormProps) {

   const dispatch = useAppDispatch();
   const modals = useModals();

   const inputOverrides = getInputOverrides(props);

   const [formdata, setFormdata] = useState<BookmarkFormdata>({
      type: BookmarkType.UNKNOWN,
      title: '',
      url: '',
      note: '',
      imageUrl: '',
      hostname: '',
      tags: [],
      ...inputOverrides
   })

   const [placeholders, setPlaceholders] = useState<Partial<BookmarkFormdata>>({})

   const [errors, setErrors] = useState<Record<string, string | null>>({});
   const [isSubmitLoading, setSubmitLoading] = useState(false);
   const [isMetadataLoading, setMetadataLoading] = useState(false);
   const [isCandidateSelected, setIsCandidateSelected] = useState(false);
   const [typeSuggestions, setTypeSuggestions] = useState<BookmarkTypeSuggestion[]>([]);
   const [candidates, setCandidates] = useState<CandidateMetadata[] | null>(null);
   const [urlAlreadyBookmarked, setUrlAlreadyBookmarked] = useState<Record<string, boolean>>({})

   const debouncedOnUrlChanged = useMemo(() =>
      debounce(async (url: string) => {
         await new Promise<void>((resolve, reject) => {
            setMetadataLoading(true);
            dispatch(getUrlMetadata(url))
               .unwrap()
               .then((metadata: Metadata | undefined) => {
                  if (!metadata) {
                     return;
                  }

                  const placeholders: Partial<BookmarkFormdata> = {};
                  if (metadata.title !== null && metadata.title.length > 0) {
                     placeholders['title'] = metadata.title;
                  }
                  if (metadata.description !== null && metadata.description.length > 0) {
                     placeholders['description'] = metadata.description;
                  }
                  setPlaceholders(placeholders);

                  const formdata: Partial<BookmarkFormdata> = {};
                  if (metadata.image !== null && metadata.image.length > 0) {
                     formdata['imageUrl'] = metadata.image;
                  }
                  if (metadata.hostname !== null && metadata.hostname.length > 0) {
                     formdata['hostname'] = metadata.hostname;
                  }
                  changeFormdataIfNotFilled(formdata);

                  setMetadataLoading(false);
                  resolve();
               })
               .catch(error => reject(error));
         });

         await new Promise<void>((resolve, reject) => {
            dispatch(getTypeSuggestions(url))
               .unwrap()
               .then((suggestions: BookmarkTypeSuggestion[]) => {
                  setTypeSuggestions(suggestions);
                  resolve();
               })
               .catch(error => reject(error));
         });
      }, 500),
      []
   );

   const debouncedGetMetadataCandidates = useMemo(() =>
      debounce((type: BookmarkType, title: string) => {
         dispatch(getMetadataCandidates({
            type,
            title
         })).unwrap()
            .then((candidates: CandidateMetadata[] | null) => {
               setCandidates(candidates);
            });
      }, 500),
      []
   );

   useEffect(() => {
      if (formdata.url.length === 0 || !isValidHttpUrl(formdata.url)) {
         return;
      }
      debouncedOnUrlChanged(formdata.url);
   }, [formdata.url]);

   useEffect(() => {
      debounceValidateFormdata(formdata);
   }, [formdata.type, formdata.title, formdata.url, formdata.note]);

   useEffect(() => {
      if (formdata.title.length === 0 || formdata.type.length === 0) {
         return;
      }
      debouncedGetMetadataCandidates(formdata.type, formdata.title);
   }, [formdata.type, formdata.title]);

   useEffect(() => {
      if (formdata.type !== BookmarkType.VIDEO || formdata.url.length === 0 || !isValidHttpUrl(formdata.url)) {
         changeFormdata({
            durationInSeconds: undefined
         });
         return;
      }

      dispatch(getVideoDurationInSeconds(formdata.url))
         .unwrap()
         .then((durationInSeconds: number) => {
            if (formdata.durationInSeconds !== undefined && formdata.durationInSeconds === durationInSeconds) {
               return;
            }

            changeFormdata({
               durationInSeconds
            });
         });
   }, [formdata.type, formdata.url]);

   useEffect(() => {
      const guaranteeTypes = typeSuggestions.filter(suggestion => suggestion.confidence === 1);
      if (guaranteeTypes.length > 0) {
         changeFormdata({ type: guaranteeTypes[0].type });
      }
   }, [typeSuggestions]);

   const validateFormdata = async (currentFormdata: BookmarkFormdata) => {
      const newErrors: Record<string, string | null> = {};
      const requiredFields = getRequiredFields();
      newErrors['type'] = formdata.type.length === 0 ? 'Type is mandatory' : null;
      newErrors['title'] = formdata.title.length === 0 && requiredFields.title === 'required' ? 'Title is mandatory' : null;
      newErrors['url'] = requiredFields.url === 'required'
         ? (formdata.url.length === 0 ? 'URL is mandatory' : null)
         : (formdata.url.length === 0 ? null : (!isValidHttpUrl(formdata.url) ? 'Invalid URL' : null));
      newErrors['note'] = formdata.note.length === 0 && requiredFields.note === 'required' ? 'Note is mandatory' : null;

      if (newErrors['url']) {
         setErrors({
            ...errors,
            ...newErrors
         });
         return;
      }

      const hiddenProperties = Object.keys(requiredFields)
         .filter(key => requiredFields[key] === 'hidden' && !formdata[key])
         .reduce((acc, key) => acc = { ...acc, [key]: '' }, {});
      if (Object.keys(hiddenProperties).length > 0) {
         changeFormdata({
            ...hiddenProperties
         })
      }

      if (props.origin !== 'edit_button') {
         let alreadyBookmarked = urlAlreadyBookmarked[formdata.url];
         if (alreadyBookmarked === undefined) {
            alreadyBookmarked = await (new Promise<boolean>((resolve, reject) => {
               dispatch(isUrlAlreadyBookmarked(formdata.url))
                  .unwrap()
                  .then((alreadyBookmarked: boolean) => resolve(alreadyBookmarked))
                  .catch(error => reject(error));
            }));
            setUrlAlreadyBookmarked({
               ...urlAlreadyBookmarked,
               [formdata.url]: alreadyBookmarked
            })
         }
         setErrors({
            ...errors,
            ...newErrors,
            url: alreadyBookmarked ? 'This URL is already bookmarked!' : null
         });
      }
   }

   const debounceValidateFormdata = useMemo(() =>
      debounce((formdata: BookmarkFormdata) =>
         validateFormdata(formdata),
         500
      ),
      []
   );

   const formdataToBookmark = (formdata: BookmarkFormdata): WithId<Bookmark> => {
      return {
         id: '',
         ...formdata,
         hostname: '',
         isArchived: false,
         createdTimestamp: new Date().getTime(),
         updatedTimestamp: new Date().getTime()
      }
   }

   const getUrlLabelByType = (): string | undefined => {
      switch (formdata.type) {
         case BookmarkType.TOOL:
            return 'Website or repository URL'
         case BookmarkType.SHOW:
         case BookmarkType.MOVIE:
            return 'IMDB URL'
         case BookmarkType.ANIME:
            return 'MyAnimeList URL'
         case BookmarkType.GAME:
            return 'Store page or website URL'
         case BookmarkType.VIDEO:
            return 'Youtube URL'
         default:
            return undefined;
      }
   }

   const getRequiredFields = (): Record<string, 'required' | 'hidden'> => {
      switch (formdata.type) {
         case BookmarkType.PLAINTEXT:
            return {
               url: 'hidden',
               note: 'required'
            };
         default:
            return {
               title: 'required',
               url: 'required',
            };
      }
   }

   const onBookmarkSubmit = async () => {
      setSubmitLoading(true);

      await validateFormdata(formdata);

      const ok = Object.values(errors).filter(v => v !== null).length === 0;
      if (!ok) {
         setSubmitLoading(false);
         notifyError(`Cannot pin this bookmark. There are still unsolved errors!\n${Object.entries(errors).filter(e => e[1]).map(e => `${e[0]}:${e[1]}\n`)}`);
         return;
      }

      dispatch(props.origin === 'edit_button'
         ? updateBookmark({
            ...props.bookmark,
            ...formdata
         })
         : saveBookmark(formdata))
         .unwrap()
         .then((response) => {
            setSubmitLoading(false);
            if (response.success) {
               dispatch(getBookmarks());
               if ((props.origin === 'import_tool' || props.origin === 'process_message') && props.onCompleted) {
                  props.onCompleted();
               }
               modals.closeAll();
            } else {
               notifyError(response.error);
            }
         });
   }

   const selectCandidate = (candidate: CandidateMetadata) => {
      setIsCandidateSelected(true);
      changeFormdata({
         ...candidate,
         // TODO: replace this mess with a function
         title: formdata.title.length > 0 ? formdata.title : (candidate.title || ''),
         url: formdata.url.length > 0 ? formdata.url : (candidate.url || ''),
         imageUrl: formdata.imageUrl.length > 0 ? formdata.imageUrl : (candidate.imageUrl || ''),
      });
   }

   const changeFormdata = (changes: Partial<BookmarkFormdata>) => {
      setFormdata(prevFormdata => ({
         ...prevFormdata,
         ...changes
      }));
   }

   const changeFormdataIfNotFilled = (changes: Partial<BookmarkFormdata>) => {
      setFormdata(prevFormdata => ({
         ...changes,
         ...prevFormdata
      }));
   }

   const acceptSuggestions = (suggestions: Partial<BookmarkFormdata>) => {
      setFormdata(prevFormdata => ({
         ...prevFormdata,
         ...suggestions
      }));
   }

   const getAcceptSuggestionButton = (field: keyof BookmarkFormdata) => {
      const shouldDisplay = placeholders[field] !== undefined && formdata[field] !== placeholders[field] && !formdata[field];
      return (
         <div hidden={!shouldDisplay}>
            <Tooltip
               label="Accept suggestion"
            >
               <ActionIcon<'button'>
                  component="button"
                  disabled={!shouldDisplay}
                  onClick={() => acceptSuggestions({
                     [field]: placeholders[field]
                  })}
               >
                  <DiscountCheck />
               </ActionIcon>
            </Tooltip>
         </div>
      );
   }

   const style = {
      sx: {
         width: 350
      }
   };

   return (
      <>
         <Group position="apart" spacing="xl" grow>
            <Stack align="center" justify="space-around" spacing="lg">
               <Select
                  label="What type of bookmark is this?"
                  placeholder={placeholders.type || "Pick one"}
                  nothingFound="Nothing..."
                  searchable
                  required
                  maxDropdownHeight={400}
                  value={formdata.type}
                  data={getTypeOptions(typeSuggestions)}
                  onChange={(type: string) => changeFormdata({ type: type as BookmarkType })}
                  error={errors.type}
                  rightSection={getAcceptSuggestionButton("type")}
                  {...style}
               />

               {getRequiredFields().url !== 'hidden' &&
                  <>
                     <Textarea
                        label={getUrlLabelByType() || 'URL'}
                        placeholder={placeholders.url || "https://..."}
                        rightSection={
                           <div>
                              {getAcceptSuggestionButton("url")}
                              <ActionIcon<'button'>
                                 component="button"
                                 disabled={!!errors.url}
                                 onClick={() => window.open(formdata.url)}
                              >
                                 <ExternalLink />
                              </ActionIcon>
                           </div>
                        }
                        value={formdata.url}
                        required={getRequiredFields().url === 'required'}
                        minRows={2} maxRows={2}
                        onChange={(event) => changeFormdata({ url: event.target.value })}
                        error={errors.url}
                        {...style}
                     />
                  </>
               }

               {getRequiredFields().title !== 'hidden' &&
                  <Textarea
                     label="Title or Name"
                     placeholder={placeholders.title || ""}
                     value={formdata.title}
                     rightSection={getAcceptSuggestionButton("title")}
                     required={getRequiredFields().title === 'required'}
                     minRows={2} maxRows={2}
                     onChange={(event) => changeFormdata({ title: event.target.value })}
                     error={errors.title}
                     {...style}
                  />
               }

               {getRequiredFields().note !== 'hidden' &&
                  <Textarea
                     label="Note"
                     placeholder={placeholders.note || "Something that might be worth mentioning..."}
                     rightSection={getAcceptSuggestionButton("note")}
                     autosize
                     required={getRequiredFields().note === 'required'}
                     minRows={2} maxRows={2}
                     value={formdata.note}
                     onChange={(event) => changeFormdata({ note: event.target.value })}
                     error={errors.note}
                     {...style}
                  />
               }

               <TagsSelect
                  values={formdata.tags}
                  error={errors.tags}
                  onChange={(tags: Id[]) => changeFormdata({ tags })}
                  {...style}
               />

               <Button
                  color="green"
                  disabled={formdata.type === null}
                  loading={isSubmitLoading}
                  leftIcon={<Pin size={14} />}
                  onClick={onBookmarkSubmit}
               >
                  Save
               </Button>
            </Stack>
            <Card>
               <LoadingOverlay visible={isMetadataLoading} />
               {formdata &&
                  <BookmarkCard {...formdataToBookmark(formdata)} viewOnly={true} />
               }
            </Card>
         </Group>
         <Space h="lg" />
         {!isCandidateSelected && candidates && candidates.length > 0 &&
            <SimpleGrid cols={2}>
               {candidates.map((candidate: CandidateMetadata) => (
                  <Stack key={candidate.url}>
                     <BookmarkCard
                        {...formdataToBookmark({
                           ...formdata,
                           ...candidate
                        })}
                        viewOnly={true}
                     />
                     <Button
                        onClick={() => selectCandidate(candidate)}
                     >
                        Use this one!
                     </Button>
                  </Stack>
               ))}
            </SimpleGrid>
         }
      </>
   );
}