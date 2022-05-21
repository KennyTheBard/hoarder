import { Image, Text, Card, Table, Button } from '@mantine/core';
import { BookmarkTypeMetadata, GameBookmark, TypeSpecificMetadata } from '../../../models';

export type MetadataCandidateCardProps = {
   type: string;
   candidate: BookmarkTypeMetadata;
   onClick: () => void;
};

export function MetadataCandidateCard(props: MetadataCandidateCardProps) {

   switch (props.type) {
      case 'game':
         const candidate = props.candidate as TypeSpecificMetadata<GameBookmark, 'game'>;
         return (
            <Card shadow="sm" p="lg">
               <Card.Section>
                  <Image src={candidate.imageUrl} height={160} alt="game cover" />
               </Card.Section>

               <Text weight={500}>{candidate.title}</Text>

               {candidate.duration &&
                  <Table>
                     <tbody>
                        <tr key="main">
                           <td>Main Story</td>
                           <td>{candidate.duration.main}</td>
                        </tr>
                        <tr key="extra">
                           <td>Main + Extra</td>
                           <td>{candidate.duration.extra}</td>
                        </tr>
                        <tr key="completionist">
                           <td>Completionist</td>
                           <td>{candidate.duration.completionist}</td>
                        </tr>
                     </tbody>
                  </Table>
               }

               <Button
                  variant="light" color="blue" fullWidth style={{ marginTop: 14 }}
                  onClick={props.onClick}
               >
                  This is the game
               </Button>
            </Card>
         );
      default:
         return (
            <Text>Nada</Text>
         );
   }

}