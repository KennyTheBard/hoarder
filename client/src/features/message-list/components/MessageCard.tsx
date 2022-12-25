import { Badge, Group, Paper, Stack, Container, Button, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { WithId, Message, MessageStatus } from 'common';
import ReactTimeAgo from 'react-time-ago';
import { MessageOff } from 'tabler-icons-react';
import { useAppDispatch } from '../../../redux/hooks';
import { deleteTags, ignoreMessages } from '../../../redux/slices';

export type MessageCardProps = {
   message: WithId<Message>;
}

export function MessageCard(props: MessageCardProps) {

   const dispatch = useAppDispatch();
   const modals = useModals();

   const openIgnoreModal = () =>
      modals.openConfirmModal({
         title: 'Mark message as ignored',
         centered: true,
         children: (
            <Text size="sm">
               This action is destructive and you will not be able to undo it!
            </Text>
         ),
         labels: { confirm: 'Ignore', cancel: 'Cancel' },
         confirmProps: { color: 'red' },
         onConfirm: () => dispatch(ignoreMessages([props.message.id]))
      });

   // const onSave = () => {
   //    setEditDialogLoading(true);
   //    dispatch(updateTag({
   //       id: tag.id,
   //       tag: {
   //          name: tagName,
   //          variant: selectedVariant,
   //          color: selectedColor
   //       }
   //    }))
   //       .unwrap()
   //       .then((result: any) => {
   //          if (result.success) {
   //             notifySuccess('Updated tag name.')
   //          } else {
   //             notifyError(result.error);
   //          }
   //          setEditDialogLoading(false);
   //          setEditDialogOpened(false);
   //       });
   // }

   const getStatusBadge = (message: Message) => {
      switch (message.status) {
         case MessageStatus.PENDING:
            return (<Badge
               color="yellow"
               variant="filled"
            >
               PENDING
            </Badge>)
         case MessageStatus.IGNORED:
            return (<Badge
               color="red"
               variant="filled"
            >
               IGNORED
            </Badge>)
         case MessageStatus.BOOKMARKED:
            return (<Badge
               color="green"
               variant="filled"
            >
               PROCESSED
            </Badge>)
      }
   }

   return (
      <Paper shadow="md" p="md">
         <Stack>
            <Group position="apart">
                  <Group position="right">
                     <Container>
                        {props.message.text}
                     </Container>
                  </Group>
                  <Group position="right">
                     {getStatusBadge(props.message)}
                     <ReactTimeAgo timeStyle="twitter" tooltip={false} date={new Date(props.message.sendAt * 1000)} />

                     {/* <Button
                        color="blue"
                        leftIcon={<Edit />}
                        onClick={() => setEditDialogOpened(true)}
                     >
                        Edit
                     </Button> */}
                     <Button
                        color="red"
                        leftIcon={<MessageOff />}
                        onClick={openIgnoreModal}
                     >
                        Ignore
                     </Button>
                  </Group>
            </Group>
         </Stack>
      </Paper>
   );
}