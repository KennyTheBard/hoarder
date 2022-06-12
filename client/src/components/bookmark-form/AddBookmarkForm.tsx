import { Button, Card, Group, LoadingOverlay, Select, SimpleGrid, Space, Stack, Textarea, TextInput } from '@mantine/core';
import { useModals } from '@mantine/modals';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pin } from 'tabler-icons-react';
import { BookmarkTypeSuggestion, Metadata, CandidateMetadata, Bookmark, BookmarkType, TypeMetadata } from '../../models';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getBookmarks, getMetadataCandidates, getTypeSuggestions, getUrlMetadata, getVideoDurationInSeconds, saveBookmark, updateBookmark } from '../../redux/slices';
import { getTypeOptions, isValidHttpUrl, notifyError, WithId } from '../../utils';
import { BookmarkCard } from '../cards';
import { TagsSelect } from './utils';

export type AddBookmarkFormProps = {
   origin: 'pin_dialog';
   pinnedText: string;
} | {
   origin: 'import_tool';
   url?: string;
   note?: string;
} | {
   origin: 'edit_button';
   bookmark: WithId<Bookmark>;
}

type BookmarkFormdata = {
   type: BookmarkType;
   title: string;
   note: string;
   url: string;
   imageUrl: string;
   tags: string[];
   [key: string]: any;
};

function getInputOverrides(props: AddBookmarkFormProps): Partial<BookmarkFormdata> {
   const ret: Partial<BookmarkFormdata> = {};

   if (props.origin === 'pin_dialog') {
      ret[isValidHttpUrl(props.pinnedText) ? 'url' : 'title'] = props.pinnedText;
   }

   if (props.origin === 'import_tool') {
      if (props.url) ret.url = props.url;
      if (props.note) ret.note = props.note;
   }

   if (props.origin === 'edit_button') {
      for (const key of Object.keys(props.bookmark)) {
         ret[key] = props.bookmark[key as keyof WithId<Bookmark>];
      }
   }

   return ret;
}

export function AddBookmarkForm(props: AddBookmarkFormProps) {

   const dispatch = useAppDispatch();
   const modals = useModals();

   const inputOverrides = getInputOverrides(props);

   const [formdata, _setFormdata] = useState<BookmarkFormdata>({
      type: BookmarkType.UNKNOWN,
      title: '',
      url: '',
      note: '',
      imageUrl: '',
      tags: [],
      ...inputOverrides
   })
   const prevFormdataRef = useRef(formdata);
   const setFormdata = (newFormData: BookmarkFormdata) => {
      prevFormdataRef.current = newFormData;
      _setFormdata(newFormData);
   }
   const setType = (type: BookmarkType) => {
      console.log(type, formdata);
      setFormdata({
         ...formdata,
         type
      });
   }
   const setTitle = (title: string) => {
      setFormdata({
         ...formdata,
         title
      });
   }
   const setNote = (note: string) => {
      setFormdata({
         ...formdata,
         note
      });
   }
   const setUrl = (url: string) => {
      setFormdata({
         ...formdata,
         url
      });
   }
   const setTags = (tags: string[]) => {
      setFormdata({
         ...formdata,
         tags
      });
   }

   const [errors, setErrors] = useState<Record<string, string | null>>({});
   const [isSubmitLoading, setSubmitLoading] = useState(false);
   const [isMetadataLoading, setMetadataLoading] = useState(false);
   const [isCandidateSelected, setIsCandidateSelected] = useState(false);
   const [typeSuggestions, setTypeSuggestions] = useState<BookmarkTypeSuggestion[]>([]);
   const [candidates, setCandidates] = useState<CandidateMetadata[] | null>(null);

   const debouncedOnUrlChanged = useCallback(
      debounce((url: string) => {
         setMetadataLoading(true);
         dispatch(getUrlMetadata(url))
            .unwrap()
            .then((metadata: Metadata | undefined) => {
               if (!metadata) {
                  return;
               }
               setFormdata({
                  ...formdata,
                  title: metadata.title !== null && metadata.title.length > 0 ? metadata.title : formdata.title,
                  note: metadata.description !== null && metadata.description.length > 0 ? metadata.description : formdata.title,
                  imageUrl: metadata.image !== null && metadata.image.length > 0 ? metadata.image : formdata.imageUrl,
                  hostname: metadata.hostname !== null && metadata.hostname.length > 0 ? metadata.hostname : formdata.hostname
               })
               setMetadataLoading(false);
               dispatch(getTypeSuggestions(url))
                  .unwrap()
                  .then((suggestions: BookmarkTypeSuggestion[]) => setTypeSuggestions(suggestions));
            });
      }, 500),
      [formdata.url]
   );
   const debouncedGetMetadataCandidates = useCallback(
      debounce((type: BookmarkType, title: string) => {
         dispatch(getMetadataCandidates({ type, title }))
            .unwrap()
            .then((candidates: CandidateMetadata[] | null) => {
               setCandidates(candidates);
            });
      }, 500),
      [formdata.title, formdata.type]
   );

   useEffect(() => {
      if (formdata.url.length === 0) {
         return;
      }
      if (!isValidHttpUrl(formdata.url)) {
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
      debouncedOnUrlChanged(formdata.url);
   }, [formdata.url]);
   useEffect(() => {
      if (formdata.title.length === 0 || formdata.type.length === 0) {
         return;
      }
      debouncedGetMetadataCandidates(formdata.type, formdata.title);
   }, [formdata.type, formdata.title]);
   useEffect(() => {
      if (formdata.type !== BookmarkType.VIDEO || formdata.url.length === 0 || !isValidHttpUrl(formdata.url)) {
         setFormdata({
            ...formdata,
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

            setFormdata({
               ...formdata,
               durationInSeconds
            });
         });
   }, [formdata.type, formdata.url])
   useEffect(() => {
      const guaranteeTypes = typeSuggestions.filter(suggestion => suggestion.confidence === 1);
      if (guaranteeTypes.length > 0) {
         setType(guaranteeTypes[0].type);
      }
   }, [typeSuggestions]);


   const formdataToBookmark = (formdata: BookmarkFormdata): WithId<Bookmark> => {
      return {
         _id: '',
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

   const validateFormdata = (): Record<string, string | null> => {
      const requiredFields = getRequiredFields();
      return {
         type: formdata.type === '' ? 'Type is mandatory' : null,

         title: requiredFields.title === 'required' && formdata.title === '' ? 'Title is mandatory' : null,
         url: requiredFields.url === 'required' && formdata.url === '' ? 'URL is mandatory' : null,
         note: requiredFields.note === 'required' && formdata.note === '' ? 'Note is mandatory' : null,
      };
   }

   const onBookmarkSubmit = async () => {
      setSubmitLoading(true);

      const errors = validateFormdata();
      setErrors(errors);

      const ok = Object.values(errors).filter(v => v !== null).length === 0;
      if (!ok) {
         setSubmitLoading(false);
         return;
      }

      dispatch(props.origin === 'edit_button' ? updateBookmark({
         ...props.bookmark,
         ...formdata
      }) : saveBookmark(formdata))
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
   const selectCandidate = (candidate: CandidateMetadata) => {
      setIsCandidateSelected(true);
      setFormdata({
         ...formdata,
         ...candidate,
         // TODO: replace this mess with a function
         title: formdata.title.length > 0 ? formdata.title : (candidate.title || ''),
         url: formdata.url.length > 0 ? formdata.url : (candidate.url || ''),
         imageUrl: formdata.imageUrl.length > 0 ? formdata.imageUrl : (candidate.imageUrl || ''),
      });
   }

   const style = {
      sx: {
         width: 350
      }
   };

   return (
      <>
         <Group direction="row" position="apart" spacing="xl" grow>
            <Stack align="center" justify="space-around" spacing="lg">
               <Select
                  label="What type of bookmark is this?"
                  placeholder="Pick one"
                  nothingFound="Nothing..."
                  searchable
                  required
                  maxDropdownHeight={400}
                  value={formdata.type}
                  data={getTypeOptions(typeSuggestions)}
                  onChange={(type: string) => setType(type as BookmarkType)}
                  error={errors.type}
                  {...style}
               />

               {getRequiredFields().url !== 'hidden' &&
                  <TextInput
                     placeholder="https://..."
                     label={getUrlLabelByType() || 'URL'}
                     value={formdata.url}
                     required={getRequiredFields().url === 'required'}
                     onChange={(event) => setUrl(event.target.value)}
                     error={errors.url}
                     {...style}
                  />
               }

               {getRequiredFields().title !== 'hidden' &&
                  <TextInput
                     label="Title or Name"
                     value={formdata.title}
                     required={getRequiredFields().title === 'required'}
                     onChange={(event) => setTitle(event.target.value)}
                     error={errors.title}
                     {...style}
                  />
               }

               {getRequiredFields().note !== 'hidden' &&
                  <Textarea
                     placeholder="Something that might be worth mentioning..."
                     label="Note"
                     autosize
                     required={getRequiredFields().note === 'required'}
                     minRows={2}
                     value={formdata.note}
                     onChange={(event) => setNote(event.target.value)}
                     error={errors.note}
                     {...style}
                  />
               }

               <TagsSelect
                  error={errors.tags}
                  onChange={(tags: string[]) => {
                     console.log(tags)
                     setTags(tags);
                  }}
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
                  <BookmarkCard bookmark={formdataToBookmark(formdata)} viewOnly={true} />
               }
            </Card>
         </Group>
         <Space h="lg" />
         {!isCandidateSelected && candidates && candidates.length > 0 &&
            <SimpleGrid cols={2}>
               {candidates.map((candidate: CandidateMetadata) => (
                  <Stack key={candidate.url}>
                     <BookmarkCard
                        bookmark={formdataToBookmark({
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