import { MultiSelect } from '@mantine/core';

export function TagsSelection(props: {
   [x: string]: any;
   onChange: any;
   error: React.ReactNode;
}) {
   const data = [
      { value: 'react', label: 'React' },
      { value: 'ng', label: 'Angular' }
   ];

   return (<>
      <MultiSelect
         label="Creatable MultiSelect"
         data={data}
         placeholder="Select items"
         searchable
         creatable
         maxDropdownHeight={160}
         getCreateLabel={(query) => `Create tag: ${query}`}
         onCreate={(query) => console.log(`Add ${query}`)}
         {...props}
      />
   </>)
}