import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { TagsSelection } from '../TagsSelection';

export function VideoBookmarkForm() {
   const form = useForm({
      initialValues: {
         url: '',
         tags: [],
      },
      validationRules: {
         url: (value: string) => value.startsWith('http://') || value.startsWith('https://')
      }
   });

   return (
      <form>
         <TextInput
            placeholder="https://..."
            label="URL"
            required
            {...form.getInputProps('url')}
         />
         <TagsSelection {...form.getInputProps('tags')} />
      </form>
   );
}