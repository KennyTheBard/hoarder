import { Stack, Container, Center, Loader, Text } from '@mantine/core';
import { Tag } from '../../models';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getTags } from '../../redux/slices';
import { WithId } from '../../utils';
import { useEffect } from "react";
import { TagCard } from './tag-card';

export function TagList() {

   const dispatch = useAppDispatch();

   const tags = useAppSelector((state) => Object.values(state.tags.tags));
   const loading = useAppSelector((state) => state.tags.loading);

   const updateTags = () => {
      dispatch(getTags());
   }
   useEffect(updateTags, []);

   return (
      <Container size="xl">
         {loading
            ? <Center><Loader color="red" size="xl" variant="dots" /></Center>
            : tags.length > 0
               ? <Stack mb="120px" align="right" justify="space-around" spacing="lg">
                  {tags.map((tag: WithId<Tag>) => <TagCard key={tag._id} tag={tag} />)}
               </Stack>
               : <Center>
                  <Text size="xl" color="grey" weight="lighter" ml="20px">No tags found</Text>
               </Center>
         }

      </Container>
   );
}