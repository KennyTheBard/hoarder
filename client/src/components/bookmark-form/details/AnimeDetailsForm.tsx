import { Checkbox, Stack } from '@mantine/core';
import { useForm } from '@mantine/hooks';

export function AnimeDetailsForm() {
   const form = useForm({
      initialValues: {
         isOnNetflix: false,
         isFinished: false,
         isAdaptation: false
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

            <Checkbox
               mt="md"
               label="Is finished"
               {...form.getInputProps('isFinished', { type: 'checkbox' })}
            />

            <Checkbox
               mt="md"
               label="Is adaptation"
               {...form.getInputProps('isAdaptation', { type: 'checkbox' })}
            />
         </Stack>
      </form>
   );
}