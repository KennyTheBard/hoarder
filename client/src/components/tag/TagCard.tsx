import { Button, Group, Paper, Text } from '@mantine/core';
import { useState } from 'react';
import { AlertTriangle, Trash } from 'tabler-icons-react';
import { Tag } from '../../models';
import { useAppDispatch } from '../../redux/hooks';
import { deleteTag } from '../../redux/slices';
import { WithId } from '../../utils';

export type TagCardProps = {
   tag: WithId<Tag>;
}

export function TagCard(props: TagCardProps) {

   const [showDeleteDialog, setShowDeleteDialog] = useState(false);

   const dispatch = useAppDispatch();
   console.log(props.tag);

   return (
      <Paper shadow="md" p="md">
         <Group position="apart">
            <Text
               component="span"
               size="lg"
            >
               {props.tag.name}
            </Text>
            <Group position="right">
               {/* <Button
                  color="orange"
                  leftIcon={<AlertTriangle />}
                  onClick={() => dispatch()}
               >
                  Edit
               </Button> */}
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