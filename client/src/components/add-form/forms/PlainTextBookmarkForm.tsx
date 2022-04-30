import { Textarea } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { TagsSelection } from '../TagsSelection';


export function PlainTextBookmarkForm() {
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
            placeholder="Autosize with no rows limit"
            label="Autosize with no rows limit"
            autosize
            minRows={2}
            {...form.getInputProps('content')}
         />
         <TagsSelection {...form.getInputProps('content')}/>
      </form>
   );
}