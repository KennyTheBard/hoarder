import { Container, Divider, Group, Space } from '@mantine/core';
import { Export } from './export';
import { Import } from './import';


export function DataTool() {

   return (
      <Container size="xl">


         <Space h={50} />
         <Group position="center">
            <Export />
            <Divider sx={{ height: '300px' }} size="sm" orientation="vertical" />
            <Import />
         </Group>
         <Space h={100} />

      </Container >
   );
}