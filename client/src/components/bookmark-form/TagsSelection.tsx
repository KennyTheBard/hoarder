import { MultiSelect } from '@mantine/core';

export function TagsSelection() {
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
      />
   </>)
}