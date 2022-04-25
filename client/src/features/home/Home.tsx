import { Card, Center, Container, Grid, Stack, TextInput } from '@mantine/core';


export function Home() {

   const entries = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

   const getListings = (columnCount: number, entries: Array<any>) => {
      return (
         <Grid justify="center">
            {Array.from(Array(columnCount).keys()).map((columnIndex: number) => getColumn(columnIndex, columnCount, entries))}
         </Grid>
      )
   }

   const getColumn = (columnIndex: number, columnCount: number, entries: Array<any>) => {
      return (
         <Grid.Col span={3}>
            <Stack>
               {entries.filter((_, index) => index % columnCount === columnIndex).map(entry => {
                  return(
                     <Card>
                        {entry}
                     </Card>
                  );
               })}
            </Stack>
         </Grid.Col>
      )
   }

   return (
      <>
         <Container>
            <Stack>
               <Center>
                  <TextInput />
               </Center>
               {getListings(4, entries)}
            </Stack>
         </Container>
      </>
   );
}