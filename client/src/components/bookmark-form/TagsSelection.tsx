import { MultiSelect } from '@mantine/core';
import { GenericInputProps } from './utils';

export function TagsSelection(props: GenericInputProps) {
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
         maxDropdownHeight={160}
         getCreateLabel={(query) => `Create tag: ${query}`}
         onCreate={(query) => console.log(`Add ${query}`)}
         {...props}
      />
   </>)
}