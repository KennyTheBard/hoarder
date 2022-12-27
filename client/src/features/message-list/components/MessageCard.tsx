import { Badge, Group, Paper, Stack, Container, Button, Text, Divider, Space, Menu, Anchor } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { WithId, Message, MessageStatus } from 'common';
import ReactTimeAgo from 'react-time-ago';
import { ChevronDown, MessageOff, MessagePlus } from 'tabler-icons-react';
import { useAppDispatch } from '../../../redux/hooks';
import { AddBookmarkForm } from '../../../components';
import { markMessages } from '../../../redux/slices';
import Linkify from 'react-linkify';

export type MessageCardProps = {
   message: WithId<Message>;
}

const STATUS_BADGE_WIDTH = 120;

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
         onConfirm: () => dispatch(markMessages({
            ids: [props.message.id],
            status: MessageStatus.IGNORED
         }))
      });

   const getStatusBadge = (message: Message) => {
      switch (message.status) {
         case MessageStatus.PENDING:
            return (<Badge
               color="yellow"
               variant="outline"
               sx={{ width: STATUS_BADGE_WIDTH }}
            >
               PENDING
            </Badge>)
         case MessageStatus.IGNORED:
            return (<Badge
               color="red"
               variant="filled"
               sx={{ width: STATUS_BADGE_WIDTH }}
            >
               IGNORED
            </Badge>)
         case MessageStatus.BOOKMARKED:
            return (<Badge
               color="green"
               variant="filled"
               sx={{ width: STATUS_BADGE_WIDTH }}
            >
               BOOKMARKED
            </Badge>)
      }
   }

   return (
      <Paper shadow="md" p="md">
         <Stack>
            <Group position="apart">
               <Group position="left">
                  <Container sx={{ width: STATUS_BADGE_WIDTH + 30 }}>
                     {getStatusBadge(props.message)}
                  </Container>
                  <ReactTimeAgo timeStyle="twitter" tooltip={false} date={new Date(props.message.sendAt * 1000)} />
               </Group>
               <Group position="right">
                  {props.message.status === MessageStatus.PENDING
                     ? <>
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
                                       onCompleted={() => dispatch(markMessages({
                                          ids: [props.message.id],
                                          status: MessageStatus.BOOKMARKED
                                       }))}
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
                     </>
                     : <>
                        <Menu>
                           <Menu.Target>
                              <Button
                                 variant="outline" color="gray"
                                 leftIcon={<ChevronDown size={24} color="gray" />}
                              >
                                 <Text size="lg" color="gray">Mark as</Text>
                              </Button>
                           </Menu.Target>
                           <Menu.Dropdown>
                              <Menu.Item
                                 onClick={() => dispatch(markMessages({
                                    ids: [props.message.id],
                                    status: MessageStatus.PENDING
                                 }))}
                              >
                                 <Text size="lg" color="orange">Pending</Text>
                              </Menu.Item>
                              {props.message.status === MessageStatus.IGNORED
                                 ? <Menu.Item
                                    onClick={() => dispatch(markMessages({
                                       ids: [props.message.id],
                                       status: MessageStatus.BOOKMARKED
                                    }))}
                                 >
                                    <Text size="lg" color="green">Bookmarked</Text>
                                 </Menu.Item>
                                 : <Menu.Item
                                    onClick={() => dispatch(markMessages({
                                       ids: [props.message.id],
                                       status: MessageStatus.IGNORED
                                    }))}
                                 >
                                    <Text size="lg" color="red">Ignored</Text>
                                 </Menu.Item>
                              }

                           </Menu.Dropdown>
                        </Menu>
                     </>
                  }

               </Group>
            </Group>
            <Divider my="sm" />
            <Group position="left">
               <Text>
               <Linkify componentDecorator={((decoratedHref: string, decoratedText: string, key: number) => (
                  <Anchor href={decoratedHref} target="_blank">
                     {decoratedText}
                  </Anchor>
               ))}>
                  {props.message.text}
               </Linkify>
               </Text>
            </Group>
            <Space />
         </Stack>
      </Paper >
   );
}