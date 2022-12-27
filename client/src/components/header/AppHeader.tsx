import { Anchor, Group, Header, Image, Menu, Text, Button } from '@mantine/core'
import { Link, useNavigate } from 'react-router-dom';
import { Tags, DatabaseImport, DatabaseExport, Settings, Mail, Tool } from 'tabler-icons-react';

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
               <Button
                  variant="subtle" color="dark"
                  leftIcon={<Tags size={24} color="white" />}
                  onClick={() => navigate('/tags')}
               >
                  <Text size="lg" color="white">Tags</Text>
               </Button>
               <Button
                  variant="subtle" color="dark"
                  leftIcon={<Mail size={24} color="white" />}
                  onClick={() => navigate('/messages')}
               >
                  <Text size="lg" color="white">Messages</Text>
               </Button>
               <Menu>
                  <Menu.Target>
                     <Button
                        variant="subtle" color="dark"
                        leftIcon={<Tool size={24} color="white" />}
                     >
                        <Text size="lg" color="white">Tools</Text>
                     </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
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
                        onClick={() => navigate('/')} // TODO: create a settings page
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