import { Badge, Group, Paper, Stack, Container, Button, Text, Tooltip, Modal, Divider, Space } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { WithId, Message, MessageStatus } from 'common';
import ReactTimeAgo from 'react-time-ago';
import { MessageOff, MessagePlus } from 'tabler-icons-react';
import { useAppDispatch } from '../../../redux/hooks';
import { markMessagesAsIgnored, markMessagesAsBookmarked } from '../../../redux/slices';
import { AddBookmarkForm } from '../../../components';

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
         onConfirm: () => dispatch(markMessagesAsIgnored([props.message.id]))
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
               sx={{ width: 100 }}
            >
               PENDING
            </Badge>)
         case MessageStatus.IGNORED:
            return (<Badge
               color="red"
               variant="filled"
               sx={{ width: 100 }}
            >
               IGNORED
            </Badge>)
         case MessageStatus.BOOKMARKED:
            return (<Badge
               color="green"
               variant="filled"
               sx={{ width: 100 }}
            >
               PROCESSED
            </Badge>)
      }
   }

   return (
      <Paper shadow="md" p="md">
         <Stack>
            <Group position="apart">
               <Group position="left">
                  <Container sx={{ width: 120 }}>
                     {getStatusBadge(props.message)}
                  </Container>
                  <ReactTimeAgo timeStyle="twitter" tooltip={false} date={new Date(props.message.sendAt * 1000)} />
               </Group>
               <Group position="right">
                  <Button
                     color="green"
                     leftIcon={<MessagePlus />}
                     onClick={() => {
                        modals.openModal({
                           title: "Process message",
                           padding: "md",
                           size: "xl",
                           centered: true,
                           children: (
                              <AddBookmarkForm
                                 origin="process_message"
                                 messageText={props.message.text}
                                 onCompleted={() => dispatch(markMessagesAsBookmarked([props.message.id]))}
                              />
                           )
                        });
                     }}
                  >
                     Process
                  </Button>
                  <Button
                     color="red"
                     onClick={openIgnoreModal}
                     leftIcon={<MessageOff />}
                  >
                     Ignore
                  </Button>
               </Group>
            </Group>
            <Divider my="sm" />
            <Group position="left">
                  {props.message.text}
            </Group>
            <Space />
         </Stack>
      </Paper >
   );
}