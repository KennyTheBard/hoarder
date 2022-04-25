import { Badge, Card, Center, Group, Space, Text } from '@mantine/core';
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { WebResource } from '../models/resource';


export interface ResourcecardProps {
   resource: WebResource
}

export function ResourceCard(props: ResourcecardProps) {

   return (
      <Card
         shadow="sm"
         p="xl"
         component="a"
      >
         <Card.Section>
            <Center>
               <LinkPreview url={props.resource.url} imageHeight={150} width={200} descriptionLength={20} />
            </Center>
         </Card.Section>
         <Space h="lg" />
         <Group>
            {props.resource.tags.map(tag => <Badge>{tag}</Badge>)}
         </Group>
         <Space h="md" />
         <Text size="xs">
            {new Date(props.resource.createdTimestamp).toLocaleString('ro')}
         </Text>
      </Card>
   );
}