import { MultiSelect, Sx } from '@mantine/core';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { addTag, getTags } from '../../../redux/slices';

export type TagsSelectProps = {
   disabled?: boolean;
   error?: string | null;
   onChange?: (value: string[]) => void;
   sx?: Sx | Sx[];
};

export function TagsSelect(props: TagsSelectProps) {
   const dispatch = useAppDispatch();
   const tags = useAppSelector((state) => state.tags.tags);

   const updateTags = () => {
      dispatch(getTags());
   }
   useEffect(updateTags, []);

   return (<>
      <MultiSelect
         label="Tags"
         data={tags
            .map(tag => tag.name)
            .map((tagName) => ({
               value: tagName,
               label: tagName
            }))}
         placeholder="Select tags"
         searchable
         creatable
         clearable
         disabled={props.disabled}
         maxDropdownHeight={160}
         getCreateLabel={(query) => `Create tag: ${query}`}
         onCreate={(query) => dispatch(addTag(query))}
         error={props.error}
         onChange={props.onChange}
         sx={props.sx}
      />
   </>)
}