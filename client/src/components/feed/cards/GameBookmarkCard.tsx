import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { ActionIcon, Anchor, Card, Center, Group, Space, Stack, Text } from '@mantine/core';
import { Checks, BrandNetflix, RocketOff, BrandWindows, BrandDebian, DeviceNintendo, BrandApple, BrandAndroid, BrandSteam, BrandAppstore } from 'tabler-icons-react';
import { GameBookmark, GamePlatform } from '../../../models/bookmark';

export interface GameBookmarkCardProps {
   bookmark: GameBookmark
}

export function GameBookmarkCard(props: GameBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <Card.Section>
         {bookmark.url &&
            <Center>
               <LinkPreview url={bookmark.url} imageHeight={150} width={300} descriptionLength={35} />
            </Center>
         }
         <Stack>
            <Space />
            <Group position="apart">
               <Text>
                  {bookmark.title} ({bookmark.publishedYear || 'TBD'})
               </Text>
               {!bookmark.published &&
                  <ActionIcon variant="transparent">
                     <RocketOff />
                  </ActionIcon>
               }
            </Group>
            <Group position="left" spacing={1}>
               {bookmark.platforms.includes(GamePlatform.WINDOWS) &&
                  <ActionIcon variant="transparent">
                     <BrandWindows />
                  </ActionIcon>
               }
               {bookmark.platforms.includes(GamePlatform.LINUX) &&
                  <ActionIcon variant="transparent">
                     <BrandSteam />
                  </ActionIcon>
               }
               {bookmark.platforms.includes(GamePlatform.MAC) &&
                  <ActionIcon variant="transparent">
                     <BrandApple />
                  </ActionIcon>
               }
               {bookmark.platforms.includes(GamePlatform.SWITCH) &&
                  <ActionIcon variant="transparent">
                     <DeviceNintendo />
                  </ActionIcon>
               }
            </Group>
         </Stack>
      </Card.Section >
   );
}