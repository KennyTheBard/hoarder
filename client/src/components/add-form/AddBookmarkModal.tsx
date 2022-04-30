import { Alert, Button, Modal, SimpleGrid } from '@mantine/core';
import { useState } from 'react';
import { DeviceGamepad, DeviceTv, Disc, FileText, IconProps, Movie, News, Video, AlertCircle, ChevronLeft } from 'tabler-icons-react';

export interface AddBookmarkModalProps {
   opened: boolean;
   onClose: () => void;
}

export function AddBookmarkModal(props: AddBookmarkModalProps) {

   const [bookmarkType, setBookmarkType] = useState<string | null>(null);

   

   const getBookmarkTypeButton = (bookmarkType: string, Icon: React.FC<IconProps>) => {
      return (
         <Button
            onClick={() => setBookmarkType(bookmarkType.toLowerCase())}
            leftIcon={<Icon size={14} />}
         >
            Text
         </Button>
      );
   }

   const getBookmarkFormByType = (bookmarkType: string) => {
      switch (bookmarkType) {
         case 'text':
         case 'article':
         case 'video':
         case 'movie':
         case 'show':
         case 'anime':
         case 'game':
         default:
            return <Alert icon={<AlertCircle size={16} />} title="Bummer!" color="red">
               Unknow bookmark type "{bookmarkType}"!
            </Alert>
      }
   }

   return (
      <Modal
         opened={props.opened}
         onClose={props.onClose}
         title="Add bookmark"
         centered
      >
         {bookmarkType ?
            <>
               {getBookmarkFormByType(bookmarkType!)}
               <Button variant="subtle" color="gray"
                  onClick={() => setBookmarkType(null)}
                  leftIcon={<ChevronLeft />}
               >
                  Back
               </Button>
            </> :
            <SimpleGrid cols={2}>
               {getBookmarkTypeButton('Text', FileText)}
               {getBookmarkTypeButton('Article', News)}
               {getBookmarkTypeButton('Video', Video)}
               {getBookmarkTypeButton('Movie', Movie)}
               {getBookmarkTypeButton('Show', DeviceTv)}
               {getBookmarkTypeButton('Anime', Disc)}
               {getBookmarkTypeButton('Game', DeviceGamepad)}
            </SimpleGrid>
         }

      </Modal >
   );
}