import { MultiSelect } from '@mantine/core';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { addTag, getTags } from '../../../redux/slices';

export type TagsSelectProps = {
   disabled?: boolean;
};

export function TagsSelect(props: TagsSelectProps) {
   const dispatch = useAppDispatch();
   const tags = useAppSelector((state) => state.tags.tags);

   const updateTags = () => {
      dispatch(getTags());
   }
   useEffect(updateTags, []);
   console.log(tags);

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
         disabled={props.disabled}
         maxDropdownHeight={160}
         getCreateLabel={(query) => `Create tag: ${query}`}
         onCreate={(query) => dispatch(addTag(query))}
      />
   </>)
}