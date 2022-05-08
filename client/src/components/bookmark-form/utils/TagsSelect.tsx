import { MultiSelect } from '@mantine/core';

export type TagsSelectProps = {
   disabled?: boolean;
};

export function TagsSelect(props: TagsSelectProps) {
   const data = [
      { value: 'react', label: 'React' },
      { value: 'ng', label: 'Angular' }
   ];

   return (<>
      <MultiSelect
         label="Tags"
         data={data}
         placeholder="Select tags"
         searchable
         creatable
         disabled={props.disabled}
         maxDropdownHeight={160}
         getCreateLabel={(query) => `Create tag: ${query}`}
         onCreate={(query) => console.log(`Add ${query}`)}
      />
   </>)
}