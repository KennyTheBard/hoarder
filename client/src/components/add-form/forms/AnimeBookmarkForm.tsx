import { TextInput, Checkbox } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { TagsSelection } from '../TagsSelection';
import { FormProps } from '../utils';

export function AnimeBookmarkForm(props: FormProps) {
   const form = useForm({
      initialValues: {
         title: '',
         imdbUrl: '',
         isOnNetflix: false,
         finished: false,
         isAdaptation: false,
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
            placeholder="https://imdb.com/..."
            label="IMDB URL"
            {...form.getInputProps('imdbUrl')}
         />

         <Checkbox
            mt="md"
            label="On netflix"
            {...form.getInputProps('isOnNetflix', { type: 'checkbox' })}
         />

         <Checkbox
            mt="md"
            label="Is finished"
            {...form.getInputProps('finished', { type: 'checkbox' })}
         />

         <Checkbox
            mt="md"
            label="Is adaptation"
            {...form.getInputProps('isAdaptation', { type: 'checkbox' })}
         />

         <TagsSelection {...form.getInputProps('tags')} />
         {props.actions}
      </form>
   );
}