import { MultiSelect, Sx } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { addTag, getTags } from '../../../redux/slices';
import { notifySuccess } from '../../../utils';

export type TagsSelectProps = {
   onChange: (value: string[]) => void;
   disabled?: boolean;
   error?: string | null;
   sx?: Sx | Sx[];
};

export function TagsSelect(props: TagsSelectProps) {
   const dispatch = useAppDispatch();

   const tagMap = useAppSelector((state) => state.tags.tags);

   const [value, setValue] = useState<string[]>([]);

   useEffect(() => {      
      dispatch(getTags());
   }, []);

   const onTagCreate = (tagName: string) => {
      dispatch(addTag(tagName))
         .unwrap()
         .then(() => {
            dispatch(getTags());
            notifySuccess(`Tag '${tagName}' created.`);
         })
   }

   return (<>
      <MultiSelect
         label="Tags"
         data={Object.values(tagMap)
            .map((tag) => ({
               value: tag._id,
               label: tag.name
            }))}
         value={value}
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
         onChange={(value: string[]) => {
            const existingTags = value.filter(tagId => tagMap[tagId]);
            setValue(existingTags);
            props.onChange(existingTags);
         }}
         sx={props.sx}
      />
   </>)
}