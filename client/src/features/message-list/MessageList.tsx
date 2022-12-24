import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getMessages } from '../../redux/slices';
import { Center, Loader, Container, Stack, Text } from '@mantine/core';
import { WithId, Message } from 'common';
import { MessageCard } from './components';


export function MessageList() {
   const dispatch = useAppDispatch();

   const messages = useAppSelector((state) => Object.values(state.messages.messages));
   const loading = useAppSelector((state) => state.messages.loading);

   useEffect(() => {
      dispatch(getMessages());
   }, []);

   let content;
   if (loading) {
      content = (
         <Center>
            <Loader color="red" size="xl" variant="dots" />
         </Center>
      );
   } else if (messages.length === 0) {
      content = (
         <Center>
            <Text size="xl" color="grey" weight="lighter" ml="20px">No tags found</Text>
         </Center>
      );
   } else {
      content = (
         <Stack mb="120px" align="right" justify="space-around" spacing="lg">
            {messages.map((message: WithId<Message>) =>
               <MessageCard message={message} />
            )}
         </Stack>
      );
   }

   return (
      <Container size="xl">
         {content}
      </Container>
   );
}