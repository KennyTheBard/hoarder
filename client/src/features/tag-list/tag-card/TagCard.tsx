import { Button, Group, Paper, Badge, Text, TextInput, ActionIcon } from '@mantine/core';
import { useState } from 'react';
import { Check, Edit, Trash } from 'tabler-icons-react';
import { Tag } from '../../../models';
import { useAppDispatch } from '../../../redux/hooks';
import { deleteTag, updateTagName } from '../../../redux/slices';
import { notifyError, notifySuccess, WithId } from '../../../utils';

export type TagCardProps = {
   tag: WithId<Tag>;
}

export function TagCard(props: TagCardProps) {

   const [isEditDialogOpened, setEditDialogOpened] = useState(false);
   const [isEditDialogLoading, setEditDialogLoading] = useState(false);
   const [newTagName, setNewTagName] = useState<string>(props.tag.name);

   const dispatch = useAppDispatch();
   console.log(props.tag);

   return (
      <Paper shadow="md" p="md">
         <Group position="apart">
            {isEditDialogOpened
               ? <Group>
                  <TextInput
                     placeholder="Tag name..."
                     value={newTagName}
                     disabled={isEditDialogLoading}
                     onChange={(event) => setNewTagName(event.target.value)}
                  />
                  <Button onClick={() => {
                     setEditDialogLoading(true);
                     dispatch(updateTagName({
                        _id: props.tag._id,
                        name: newTagName
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
                  }}
                     leftIcon={<Check />}
                     loading={isEditDialogLoading}
                  />
               </Group>
               : <Badge
                  size="lg"
                  color="blue"
               >
                  {props.tag.name}
               </Badge>
            }

            <Group position="right">
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
                  onClick={() => dispatch(deleteTag(props.tag._id))}
               >
                  Delete
               </Button>
            </Group>
         </Group>
      </Paper>
   );
}