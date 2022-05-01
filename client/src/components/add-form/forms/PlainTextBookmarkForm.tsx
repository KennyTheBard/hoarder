import { Textarea } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { TagsSelection } from '../TagsSelection';
import { FormProps } from '../utils';


export function PlainTextBookmarkForm(props: FormProps) {
   const form = useForm({
      initialValues: {
         content: '',
         tags: [],
      },
      validationRules: {
         content: (value: string) => value.length <= 10000
      }
   });

   return (
      <form>
         <Textarea
            placeholder="Your text here..."
            label="Content"
            autosize required
            minRows={2}
            {...form.getInputProps('content')}
         />
         <TagsSelection {...form.getInputProps('tags')}/>
         {props.actions}
      </form>
   );
}