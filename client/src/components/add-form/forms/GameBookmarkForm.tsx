import { TextInput, Checkbox, MultiSelect } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { TagsSelection } from '../TagsSelection';

export function GameBookmarkForm() {

   const form = useForm({
      initialValues: {
         title: '',
         url: '',
         published: false,
         platforms: [],
         tags: [],
      },
      validationRules: {

      }
   });

   return (
      <form>
         <TextInput
            placeholder="International title of the movie"
            label="Title"
            required
            {...form.getInputProps('title')}
         />

         <TextInput
            placeholder="https://..."
            label="URL to store page or game website"
            {...form.getInputProps('url')}
         />

         <Checkbox
            mt="md"
            label="Is published"
            {...form.getInputProps('published', { type: 'checkbox' })}
         />

         <MultiSelect
            data={[
               { value: 'Windows', label: 'Windows' },
               { value: 'Linux', label: 'Linux' },
               { value: 'MacOS', label: 'MacOS' },
               { value: 'Nintendo Switch', label: 'Nintendo Switch' },
            ]}
            {...form.getInputProps('platforms')}
         />

         <TagsSelection {...form.getInputProps('tags')} />
      </form>
   );
}