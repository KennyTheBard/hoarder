import { Alert, Button, Group, MantineColor, Modal, SimpleGrid, Stack } from '@mantine/core';
import { useState } from 'react';
import { DeviceGamepad, DeviceTv, Disc, FileText, IconProps, Movie, News, Video, AlertCircle, ChevronLeft, Check } from 'tabler-icons-react';
import { AnimeBookmarkForm, ArticleBookmarkForm, GameBookmarkForm, MovieBookmarkForm, ShowBookmarkForm, VideoBookmarkForm } from './forms';

export interface AddBookmarkModalProps {
   opened: boolean;
   onClose: () => void;
}

export function AddBookmarkModal(props: AddBookmarkModalProps) {

   const [bookmarkType, setBookmarkType] = useState<string | null>(null);

   const getBookmarkTypeButton = (bookmarkType: string, Icon: React.FC<IconProps>, color: MantineColor = 'blue') => {
      return (
         <Button
            onClick={() => setBookmarkType(bookmarkType.toLowerCase())}
            leftIcon={<Icon size={18} />}
            color={color}
         >
            {bookmarkType}
         </Button>
      );
   }

   const formActions = (
      <Group>
         <Button variant="subtle" color="red"
            onClick={() => setBookmarkType(null)}
            leftIcon={<ChevronLeft />}
         >
            Back
         </Button>
         <Button variant="subtle" color="green"
            leftIcon={<Check />}
         >
            Save
         </Button>
      </Group>
   );

   const getBookmarkFormByType = (bookmarkType: string) => {
      switch (bookmarkType) {
         case 'article':
            return <ArticleBookmarkForm actions={formActions}/>
         case 'tool':
            return <></>
         case 'video':
            return <VideoBookmarkForm actions={formActions}/>
         case 'movie':
            return <MovieBookmarkForm actions={formActions}/>
         case 'show':
            return <ShowBookmarkForm actions={formActions}/>
         case 'anime':
            return <AnimeBookmarkForm actions={formActions}/>
         case 'game':
            return <GameBookmarkForm actions={formActions}/>
         default:
            return <Alert icon={<AlertCircle size={16} />} title="Bummer!" color="red">
               Unknow bookmark type "{bookmarkType}"!
            </Alert>
      }
   }

   return (
      <Modal
         opened={props.opened}
         onClose={() => {
            props.onClose();
            setTimeout(() => setBookmarkType(null), 300);
         }}
         title="Add bookmark"
         centered
      >
         {bookmarkType ?
            <Stack align="center" spacing="lg">
               {getBookmarkFormByType(bookmarkType!)}

            </Stack> :
            <SimpleGrid cols={1}>
               {getBookmarkTypeButton('Text', FileText, 'indigo')}
               {getBookmarkTypeButton('Article', News)}
               {getBookmarkTypeButton('Video', Video, 'cyan')}
               {getBookmarkTypeButton('Movie', Movie, 'teal')}
               {getBookmarkTypeButton('Show', DeviceTv, 'green')}
               {getBookmarkTypeButton('Anime', Disc, 'lime')}
               {getBookmarkTypeButton('Game', DeviceGamepad, 'yellow')}
            </SimpleGrid>
         }

      </Modal >
   );
}