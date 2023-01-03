import { MultiSelect, Sx } from '@mantine/core';
import { Id } from 'common';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { addTag, getAllTags } from '../../../redux/slices';
import { notifySuccess } from '../../../utils';

export type TagsSelectProps = {
   onChange: (value: string[]) => void;
   values?: Id[];
   disabled?: boolean;
   error?: string | null;
   sx?: Sx | Sx[];
};

export function TagsSelect(props: TagsSelectProps) {
   const dispatch = useAppDispatch();

   const tagMap = useAppSelector((state) => state.tagSlice.tagMaps);

   const [selectedTags, setSelectedTags] = useState<Id[]>([...(props.values || [])].sort());

   useEffect(() => {
      dispatch(getAllTags());
   }, []);

   const onTagCreate = (tagName: string) => {
      dispatch(addTag(tagName))
         .unwrap()
         .then((result: any) => {
            const newTagId = result.tag.id;
            const tags = [...selectedTags];
            if (!tags.find(t => t === newTagId)) {
               tags.push(newTagId);
            }
            onChange(tags);
            setSelectedTags(tags);
            notifySuccess(`Tag '${tagName}' created.`);
         });
      return null;
   }

   const onChange = (newTags: string[]) => {
      const sortedTags = newTags.sort();
      setSelectedTags(sortedTags);
      props.onChange(sortedTags);
   };

   return (<>
      <MultiSelect
         label="Tags"
         data={Object.values(tagMap)
            .map((tag) => ({
               value: tag.id,
               label: tag.name
            }))}
         value={selectedTags}
         placeholder="Select tags"
         searchable
         creatable
         clearable
         disabled={props.disabled}
         maxDropdownHeight={160}
         getCreateLabel={(query) => `Create tag: ${query}`}
         onCreate={(query) => onTagCreate(query)}
         filter={(value, selected, item) =>
            !selected && !!item.label && item.label.toLowerCase().includes(value.toLowerCase().trim())
         }
         error={props.error}
         onChange={onChange}
         sx={props.sx}
      />
   </>)
}