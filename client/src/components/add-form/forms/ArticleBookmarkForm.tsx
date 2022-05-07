import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getUrlMetadata } from '../../../redux/slices/metadataSlice';
import { TagsSelection } from '../TagsSelection';
import { enhanceInputProps, FormProps } from '../utils';
import debounce from 'lodash.debounce';
import { useCallback } from 'react';

export function ArticleBookmarkForm(props: FormProps) {
   const form = useForm({
      initialValues: {
         url: '',
         tags: [],
      },
      validationRules: {
         url: (value: string) => value.startsWith('http://') || value.startsWith('https://')
      }
   });

   const dispatch = useAppDispatch();

   const onUrlChange = useCallback(
      debounce((value: string) => {
         dispatch(getUrlMetadata(value));
      }, 300),
      []
   );

   const metadata = useAppSelector((state) => state.metadata.metadata);

   return (
      <form>
         <TextInput
            placeholder="https://..."
            label="URL"
            required
            {...enhanceInputProps(form.getInputProps('url'), onUrlChange)}
         />

         {JSON.stringify(metadata)}

         <TagsSelection {...form.getInputProps('tags')} />
         {props.actions}
      </form>
   );
}