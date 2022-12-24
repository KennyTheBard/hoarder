import { Anchor, Group, Header, Image, Menu, Text, Divider, ActionIcon } from '@mantine/core'
import { Link, useNavigate } from 'react-router-dom';
import { Home, Tags, Menu2, DatabaseImport, DatabaseExport, Settings, Mailbox } from 'tabler-icons-react';

export function AppHeader() {
   const navigate = useNavigate();

   return (
      <Header height={75} p="xs" sx={(theme) => ({
         backgroundColor: '#1F1F1F'
      })}>
         <Group position="apart">
            <Anchor component={Link} to="/">
               <Group>
                  <Image
                     radius="md"
                     src="/HoarderLogo.svg"
                     alt="Hoarder logo"
                     width={50} height={50} />

                  <Text color="white"
                     style={{
                        fontWeight: 1000,
                        fontSize: 32
                     }}
                  >
                     Hoarder
                  </Text>
               </Group>
            </Anchor>

            <Group position="right">
               <Menu>
                  <Menu.Target>
                     <ActionIcon>
                        <Menu2
                           size={64}
                           strokeWidth={2}
                           color={'white'}
                        />
                     </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                     <Menu.Label>Pages</Menu.Label>
                     <Menu.Item
                        icon={<Home size={24} />}
                        onClick={() => navigate('/')}
                     >
                        <Text size="lg">Home</Text>
                     </Menu.Item>
                     <Menu.Item
                        icon={<Tags size={24} />}
                        onClick={() => navigate('/tags')}
                     >
                        <Text size="lg">Tags</Text>
                     </Menu.Item>
                     <Menu.Item
                        icon={<Mailbox size={24} />}
                        onClick={() => navigate('/messages')}
                     >
                        <Text size="lg">Messages</Text>
                     </Menu.Item>
                     <Divider />

                     <Menu.Label>Tools</Menu.Label>
                     <Menu.Item
                        icon={<DatabaseImport size={24} />}
                        onClick={() => navigate('/import')}
                     >
                        <Text size="lg">Import</Text>
                     </Menu.Item>
                     <Menu.Item
                        icon={<DatabaseExport size={24} />}
                        onClick={() => navigate('/export')}
                     >
                        <Text size="lg">Export</Text>
                     </Menu.Item>
                     <Menu.Item
                        icon={<Settings size={24} />}
                        onClick={() => navigate('/')}
                     >
                        <Text size="lg">Settings</Text>
                     </Menu.Item>
                  </Menu.Dropdown>
               </Menu>
            </Group>
         </Group>
      </Header>

   );
}