import { Box, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import debounce from 'lodash.debounce';
import { useCallback } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { enhanceInputProps } from './utils';

export type GeneralDetailsFormProps = {
   titleLabel?: string;
   urlLabel?: string;
   onUrlChange?: (value: string) => void;
   onTitleChange?: (value: string) => void;
   children?: React.ReactNode;
}

export function GeneralDetailsForm(props: GeneralDetailsFormProps) {

   const title = useAppSelector((state) => state.addBookmark.title);
   const url = useAppSelector((state) => state.addBookmark.url);

   const form = useForm({
      initialValues: {
         title: '',
         url: '',
      },
      validationRules: {
         title: (value: string) => value.trim().length === 0,
         url: (value: string) => value.trim().length === 0 || value.startsWith('http://') || value.startsWith('https://'),
      },
      errorMessages: {
         title: 'Empty title not accepted',
         url: 'Wrong URL format',
      }
   });

   const onUrlChange = useCallback(
      debounce((value: string) => {
         if (props.onUrlChange) props.onUrlChange(value);
      }, 300),
      [form.values.url]
   );

   const onTitleChange = useCallback(
      debounce((value: string) => {
         if (props.onTitleChange) props.onTitleChange(value);
      }, 300),
      [form.values.title]
   );

   return (
      <form>
         <Stack align="center" justify="space-around" spacing="lg">
            <TextInput
               placeholder="https://..."
               label={props.urlLabel || 'URL'}
               value={url || form.values.url}
               required
               {...enhanceInputProps(form.getInputProps('url'), onUrlChange)}
            />

            <TextInput
               label={props.titleLabel || 'Title'}
               value={title || form.values.title}
               required
               {...enhanceInputProps(form.getInputProps('title'), onTitleChange)}
            />

            {props.children}
         </Stack>
      </form>
   );
}