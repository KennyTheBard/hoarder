import { Checkbox, Stack } from '@mantine/core';
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
         <Stack align="center" justify="space-around" spacing="lg">
            <Checkbox
               mt="md"
               label="On netflix"
               {...form.getInputProps('isOnNetflix', { type: 'checkbox' })}
            />
         </Stack>
      </form>
   );
}