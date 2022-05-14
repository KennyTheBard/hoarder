import { Stack, Container } from '@mantine/core';
import { Tag } from '../../models';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getTags } from '../../redux/slices';
import { WithId } from '../../utils';
import { useEffect } from "react";
import { TagCard } from './tag-card';

export function TagList() {

   const tags = useAppSelector((state) => state.tags.tags);
   const dispatch = useAppDispatch();

   const updateTags = () => {
      dispatch(getTags());
   }
   useEffect(updateTags, []);

   return (
      <Container size="xl">
         <Stack align="right" justify="space-around" spacing="lg">
            {tags.map((tag: WithId<Tag>) => <TagCard key={tag._id} tag={tag} />)}
         </Stack>
      </Container>
   );
}