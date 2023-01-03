import { Stack, Container, Center, Loader, Text, Checkbox, Grid, Affix, Button, Transition } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { deleteTags, getTagsExtended } from '../../redux/slices';
import { useEffect, useState } from 'react';
import { TagCard } from './components';
import { WithId, Id, TagExtended } from 'common';
import { Trash } from 'tabler-icons-react';
import { useModals } from '@mantine/modals';

export function TagList() {

   const dispatch = useAppDispatch();

   const modals = useModals();
   const tagsExtended = useAppSelector((state) => Object.values(state.tagSlice.tagsExtended));
   const loading = useAppSelector((state) => state.tagSlice.loading);
   const [checkedTags, setCheckedTags] = useState<Record<Id, boolean>>({});

   const openDeleteModal = () =>
      modals.openConfirmModal({
         title: 'Delete tags',
         centered: true,
         children: (
            <Text size="sm">
               This action is destructive and you will not be able to undo it!
            </Text>
         ),
         labels: { confirm: 'Delete', cancel: 'Cancel' },
         confirmProps: { color: 'red' },
         onConfirm: () => dispatch(
            deleteTags(
               Object.entries(checkedTags)
                  .filter(e => e[1] === true)
                  .map(e => e[0])
            )
         )
      });

   useEffect(() => {
      dispatch(getTagsExtended());
   }, []);

   let content;
   if (loading) {
      content = (
         <Center>
            <Loader color="red" size="xl" variant="dots" />
         </Center>
      );
   } else if (tagsExtended.length === 0) {
      content = (
         <Center>
            <Text size="xl" color="grey" weight="lighter" ml="20px">No tags found</Text>
         </Center>
      );
   } else {
      content = (
         <Stack mb="120px" align="right" justify="space-around" spacing="lg">
            {tagsExtended.map((tag: WithId<TagExtended>) =>
               <Grid key={tag.id} columns={24}>
                  <Grid.Col span={1}>
                     <Center style={{ height: 70 }}>
                        <Checkbox
                           onChange={(event) => setCheckedTags({
                              ...checkedTags,
                              [tag.id]: event.currentTarget.checked,
                           })}
                        />
                     </Center>
                  </Grid.Col>
                  <Grid.Col span={23}>
                     <TagCard tag={tag} />
                  </Grid.Col>
               </Grid>
            )}
         </Stack>
      );
   }

   return (
      <Container size="xl">
         {content}
         <Affix position={{ bottom: 20, left: 20 }}>
            <Transition transition="slide-up" mounted={!!Object.values(checkedTags).find(checked => checked === true)}>
               {(transitionStyles) => (
                  <Button
                     color="red"
                     leftIcon={<Trash size={16} />}
                     style={transitionStyles}
                     onClick={openDeleteModal}
                  >
                     Delete
                  </Button>
               )}
            </Transition>
         </Affix>
      </Container>
   );
}