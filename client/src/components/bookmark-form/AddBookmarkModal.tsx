import { Alert, Button, Group, MantineColor, Modal, SimpleGrid, Stack, Stepper } from '@mantine/core';
import { useState } from 'react';
import { DeviceGamepad, DeviceTv, Disc, FileText, IconProps, Movie, News, Video, AlertCircle, ChevronLeft, Check, Tool } from 'tabler-icons-react';
import { Metadata } from '../../models';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUrlMetadata, setTitle, setUrl } from '../../redux/slices';
import { AnimeDetailsForm, ArticleDetailsForm, GameDetailsForm, MovieDetailsForm, ShowDetailsForm, VideoDetailsForm } from './details';
import { GeneralDetailsForm } from './GeneralDetailsForm';
import { TagsSelection } from './TagsSelection';
import { MetadataPreview } from './utils';

export interface AddBookmarkModalProps {
   opened: boolean;
   onClose: () => void;
}

export function AddBookmarkModal(props: AddBookmarkModalProps) {

   const [bookmarkType, setBookmarkType] = useState<string | null>(null);
   const [active, setActive] = useState(0);
   const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
   const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

   const metadata = useAppSelector((state) => state.addBookmark.metadata);
   const dispatch = useAppDispatch();

   const getBookmarkTypeButton = (bookmarkType: string, Icon: React.FC<IconProps>, color: MantineColor = 'blue') => {
      return (
         <Button
            onClick={() => {
               setBookmarkType(bookmarkType.toLowerCase());
               nextStep();
            }}
            leftIcon={<Icon size={18} />}
            color={color}
         >
            {bookmarkType}
         </Button>
      );
   }

   const getTitleLabelByType = (bookmarkType: string | null): string | undefined => {
      switch (bookmarkType) {
         case 'game':
         case 'tool':
            return 'Name'
         case 'movie':
         case 'show':
         case 'anime':
            return 'International name'
         default:
            return undefined;
      }
   }

   const getUrlLabelByType = (bookmarkType: string | null): string | undefined => {
      switch (bookmarkType) {
         case 'tool':
            return 'website or repository URL'
         case 'show':
         case 'movie':
            return 'IMDB URL'
         case 'anime':
            return 'MyAnimeList URL'
         case 'game':
            return 'Store page or website URL'
         default:
            return undefined;
      }
   }

   const getBookmarkFormByType = (bookmarkType: string) => {
      switch (bookmarkType) {
         case 'article':
            return <ArticleDetailsForm />
         case 'tool':
            return <></>
         case 'video':
            return <VideoDetailsForm />
         case 'movie':
            return <MovieDetailsForm />
         case 'show':
            return <ShowDetailsForm />
         case 'anime':
            return <AnimeDetailsForm />
         case 'game':
            return <GameDetailsForm />
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
         size="55%"
         centered
      >
         <Stepper active={active} onStepClick={setActive} breakpoint="sm">
            <Stepper.Step label="Type" description="Bookmark type" allowStepSelect={active > 0}>
               <SimpleGrid cols={2} spacing="md">
                  {getBookmarkTypeButton('Article', News)}
                  {getBookmarkTypeButton('Tool', Tool, 'indigo')}
                  {getBookmarkTypeButton('Video', Video, 'cyan')}
                  {getBookmarkTypeButton('Movie', Movie, 'teal')}
                  {getBookmarkTypeButton('Show', DeviceTv, 'green')}
                  {getBookmarkTypeButton('Anime', Disc, 'lime')}
                  {getBookmarkTypeButton('Game', DeviceGamepad, 'yellow')}
               </SimpleGrid>
            </Stepper.Step>

            <Stepper.Step label="URL & Title" description="General for all" allowStepSelect={active > 1}>
               <GeneralDetailsForm
                  urlLabel={getUrlLabelByType(bookmarkType)}
                  titleLabel={getTitleLabelByType(bookmarkType)}
                  onUrlChange={(url: string) => {
                     dispatch(setUrl(url));
                     dispatch(getUrlMetadata(url))
                        .unwrap()
                        .then((data: Metadata) => {
                           if (data.title !== null && data.title !== '') dispatch(setTitle(data.title));
                        });
                  }}
                  onTitleChange={(title: string) => {
                     dispatch(setTitle(title));
                  }}
               >
                  {metadata !== undefined &&
                     <MetadataPreview metadata={metadata} />
                  }
               </GeneralDetailsForm>
            </Stepper.Step>

            <Stepper.Step label="Details" description="Specific for type" allowStepSelect={active > 2}>
               <Stack align="center" justify="space-around" spacing="lg">
                  {getBookmarkFormByType(bookmarkType!)}
               </Stack>
            </Stepper.Step>

            <Stepper.Step label="Tags" description="Used for querying" allowStepSelect={active > 3}>
               <Stack align="center" justify="space-around" spacing="lg">
                  <TagsSelection />
               </Stack>
            </Stepper.Step>

            <Stepper.Completed>
               Completed, click back button to get to previous step
            </Stepper.Completed>
         </Stepper>

         <Group>
            <Button variant="subtle" color="red"
               onClick={() => prevStep()}
               leftIcon={<ChevronLeft />}
            >
               Back
            </Button>
            {active <= 3 && active !== 0 &&
               <Button variant="subtle" color="green"
                  onClick={() => nextStep()}
                  leftIcon={<Check />}
               >
                  Next
               </Button>
            }
            {active > 3 &&
               <Button variant="subtle" color="green"
                  leftIcon={<Check />}
               >
                  Save
               </Button>
            }

         </Group>

      </Modal >
   );
}