import { ActionIcon, Badge, Button, Card, Center, Group, Space, Spoiler, Text } from '@mantine/core';
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { WebResource } from '../models/resource';
import { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Edit, TrashX } from 'tabler-icons-react';


export interface ResourcecardProps {
   resource: WebResource
}

export function ResourceCard(props: ResourcecardProps) {

   const [expanded, setExpanded] = useState<boolean>(false);
   const spoilerRef = useRef<HTMLButtonElement | null>(null);

   return (
      <Card
         shadow="sm"
         radius={6}
         p="xl"
         component="a"
         onMouseEnter={() => setExpanded(true)}
         onMouseLeave={() => setExpanded(false)}
      >
         <Card.Section>
            <Center>
               <LinkPreview url={props.resource.url} imageHeight={150} width={300} descriptionLength={35} />
            </Center>
         </Card.Section>
         <Space h="lg" />
         <Group>
            {props.resource.tags.map(tag => <Badge>{tag}</Badge>)}
         </Group>
         <Space h="md" />

         {expanded &&
            <>
               <Text size="xs">
                  {new Date(props.resource.createdTimestamp).toLocaleString('ro')}
               </Text>
               <Space h="md" />
               <Group>
                  <Button size="xs" leftIcon={<Edit size={14}/>}>
                     Edit
                  </Button>
                  <Button size="xs" leftIcon={<TrashX size={14}/>} color="red">
                     Delete
                  </Button>
               </Group>
            </>
         }
      </Card>
   );
}