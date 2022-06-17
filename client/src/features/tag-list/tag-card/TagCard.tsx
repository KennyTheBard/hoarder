import { Button, Group, Paper, Badge, Text, TextInput, ColorSwatch, MantineColor, useMantineTheme, Stack, Select } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { WithId, Tag } from 'common';
import { useState } from 'react';
import { Check, Edit, Trash, X } from 'tabler-icons-react';
import { TagBadge } from '../../../components';
import { useAppDispatch } from '../../../redux/hooks';
import { deleteTag, updateTag } from '../../../redux/slices';
import { DEFAULT_TAG_COLOR, DEFAULT_TAG_VARIANT, notifyError, notifySuccess } from '../../../utils';

export type TagCardProps = {
   tag: WithId<Tag>;
}

export function TagCard(props: TagCardProps) {
   const tag = props.tag;

   const dispatch = useAppDispatch();
   const modals = useModals();
   const theme = useMantineTheme();

   const [isEditDialogOpened, setEditDialogOpened] = useState(false);
   const [isEditDialogLoading, setEditDialogLoading] = useState(false);
   const [tagName, setTagName] = useState<string>(tag.name);
   const [selectedColor, setSelectedColor] = useState<string>(tag.color ? tag.color : 'blue');
   const [selectedVariant, setSelectedVariant] = useState<'light' | 'filled'>(tag.variant ? tag.variant : 'light');


   const swatches = Object.keys(theme.colors).map((color: string) => (
      <ColorSwatch
         key={color}
         component="button"
         color={theme.colors[color][6]}
         onClick={() => setSelectedColor(color)}
         style={{ color: '#fff', cursor: 'pointer' }}
      >
         {color === selectedColor && <Check size="18" />}
      </ColorSwatch>
   ));

   const openDeleteModal = () =>
      modals.openConfirmModal({
         title: 'Delete tag',
         centered: true,
         children: (
            <Text size="sm">
               This action is destructive and you will not be able to undo it!
            </Text>
         ),
         labels: { confirm: 'Delete', cancel: 'Cancel' },
         confirmProps: { color: 'red' },
         onConfirm: () => dispatch(deleteTag(tag._id))
      });

   const onSave = () => {
      setEditDialogLoading(true);
      dispatch(updateTag({
         id: tag._id,
         tag: {
            name: tagName,
            variant: selectedVariant,
            color: selectedColor
         }
      }))
         .unwrap()
         .then((result: any) => {
            if (result.success) {
               notifySuccess('Updated tag name.')
            } else {
               notifyError(result.error);
            }
            setEditDialogLoading(false);
            setEditDialogOpened(false);
         });
   }

   return (
      <Paper shadow="md" p="md">
         <Stack>
            <Group position="apart">
               <TagBadge
                  size="lg"
                  name={isEditDialogOpened ? tagName : tag.name}
                  variant={isEditDialogOpened ? selectedVariant : (tag.variant ? tag.variant : DEFAULT_TAG_VARIANT)}
                  color={isEditDialogOpened ? selectedColor : (tag.color ? tag.color : DEFAULT_TAG_COLOR)}
               />

               <Group position="right">
                  {isEditDialogOpened
                     ? <>
                        <Button
                           color="red"
                           onClick={() => setEditDialogOpened(false)}
                           loading={isEditDialogLoading}
                           leftIcon={<X />}
                        >
                           Cancel
                        </Button>
                        <Button
                           color="green"
                           onClick={onSave}
                           leftIcon={<Check />}
                           loading={isEditDialogLoading}
                        >
                           Save
                        </Button>
                     </>
                     : <>
                        <Button
                           color="blue"
                           leftIcon={<Edit />}
                           onClick={() => setEditDialogOpened(true)}
                        >
                           Edit
                        </Button>
                        <Button
                           color="red"
                           leftIcon={<Trash />}
                           onClick={openDeleteModal}
                        >
                           Delete
                        </Button>
                     </>
                  }
               </Group>
            </Group>
            {isEditDialogOpened &&
               <Group>
                  <TextInput
                     label="Name"
                     value={tagName}
                     disabled={isEditDialogLoading}
                     onChange={(event) => setTagName(event.target.value)}
                  />
                  <Select
                     label="Variant"
                     defaultValue={selectedVariant}
                     onChange={(variant: 'light' | 'filled') => setSelectedVariant(variant)}
                     data={[
                        { value: 'light', label: 'light' },
                        { value: 'filled', label: 'filled' }
                     ]}
                  />
                  <Stack>
                     <Text sx={{ fontSize: "14px" }}>
                        Color
                     </Text>
                     <Group position="center" spacing="xs">
                        {swatches}
                     </Group>
                  </Stack>

               </Group>
            }
         </Stack>

      </Paper>
   );
}