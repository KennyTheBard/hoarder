import { Anchor, Button, Group, Header, Image, Text } from '@mantine/core'
import { Link } from 'react-router-dom';

export function AppHeader() {

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
               <Button component={Link} to="/">
                  Home
               </Button>
               <Button component={Link} to="/tags">
                  Tags
               </Button>
            </Group>
         </Group>
      </Header>

   );
}