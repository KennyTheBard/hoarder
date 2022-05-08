import { Checkbox } from '@mantine/core';
import { useForm } from '@mantine/hooks';

export function MovieDetailsForm() {
   const form = useForm({
      initialValues: {
         isOnNetflix: false,
      },
      validationRules: {}
   });

   return (
      <form>
         <Checkbox
            mt="md"
            label="On netflix"
            {...form.getInputProps('isOnNetflix', { type: 'checkbox' })}
         />
      </form>
   );
}