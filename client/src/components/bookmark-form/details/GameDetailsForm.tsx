import { Checkbox, MultiSelect, Stack } from '@mantine/core';
import { useForm } from '@mantine/hooks';

export function GameDetailsForm() {

   const form = useForm({
      initialValues: {
         launched: false,
         platforms: [],
      },
      validationRules: {}
   });

   return (
      <form>
         <Stack align="center" justify="space-around" spacing="lg">
            <Checkbox
               mt="md"
               label="Is published"
               {...form.getInputProps('launched', { type: 'checkbox' })}
            />

            <MultiSelect
               label="Platform available on"
               data={[
                  { value: 'Windows', label: 'Windows' },
                  { value: 'Linux', label: 'Linux' },
                  { value: 'MacOS', label: 'MacOS' },
                  { value: 'Nintendo Switch', label: 'Nintendo Switch' },
               ]}
               {...form.getInputProps('platforms')}
            />
         </Stack>
      </form>
   );
}