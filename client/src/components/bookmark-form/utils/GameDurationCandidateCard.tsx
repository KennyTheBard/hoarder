import { Image, Text, Card, Table, Button } from '@mantine/core';
import { GameDurationCandidate } from '../../../models';

export type GameDurationCandidateProps = {
   candidate: GameDurationCandidate;
   onClick: () => void;
};

export function GameDurationCandidateCard(props: GameDurationCandidateProps) {
   return (
      <Card shadow="sm" p="lg">
         <Card.Section>
            <Image src={props.candidate.imageUrl} height={160} alt="game cover" />
         </Card.Section>

         <Text weight={500}>{props.candidate.title}</Text>

         <Table>
            <tbody>
               <tr key="main">
                  <td>Main Story</td>
                  <td>{props.candidate.duration.main}</td>
               </tr>
               <tr key="extra">
                  <td>Main + Extra</td>
                  <td>{props.candidate.duration.extra}</td>
               </tr>
               <tr key="completionist">
                  <td>Completionist</td>
                  <td>{props.candidate.duration.completionist}</td>
               </tr>
            </tbody>
         </Table>

         <Button
            variant="light" color="blue" fullWidth style={{ marginTop: 14 }}
            onClick={props.onClick}
         >
            This is the game
         </Button>
      </Card>
   );
}