import { Center, Container, Input, Space, Stack } from '@mantine/core';
import { BoardFeed } from '../../components/BoardFeed';
import { WebResource } from '../../models/resource';
import { Search } from 'tabler-icons-react';

export function Home() {

   const entries: WebResource[] = [{
      url: 'https://medium.com/edonec/creating-a-generic-component-with-react-typescript-2c17f8c4386e',
      hostname: 'medium.com',
      type: 'web',
      tags: ['react', 'generic'],
      createdTimestamp: new Date().getTime(),
      updatedTimestamp: new Date().getTime()
   }, {
      url: 'https://medium.com/edonec/creating-a-generic-component-with-react-typescript-2c17f8c4386e',
      hostname: 'medium.com',
      type: 'web',
      tags: ['react', 'generic'],
      createdTimestamp: new Date().getTime(),
      updatedTimestamp: new Date().getTime()
   }];

   return (
      <>
         <Container size="xl">
            <Stack>
               <Space h={50} />
               <Center>
                  <Input
                     icon={<Search size={16}/>}
                     placeholder="Search..."
                  />
               </Center>
               <Space h={20} />
               <BoardFeed columnCount={4} entries={entries} />
               {/* TODO: add loading more spinner or "that's all" */}
            </Stack>
         </Container>
      </>
   );
}