import { ActionIcon, Group, Text } from '@mantine/core';
import { RocketOff, BrandWindows, DeviceNintendo, BrandApple, BrandSteam } from 'tabler-icons-react';
import { GameBookmark, GamePlatform } from '../../../../models/bookmark';

export interface GameBookmarkCardProps {
   bookmark: GameBookmark
}

export function GameBookmarkCard(props: GameBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <>
         <Group position="apart">
            <Text>
               {bookmark.title} ({bookmark.launchDate || 'TBD'})
            </Text>
            {!bookmark.isLaunched &&
               <ActionIcon variant="transparent">
                  <RocketOff />
               </ActionIcon>
            }
         </Group>
         <Group position="left" spacing={1}>
            {bookmark.platforms && bookmark.platforms.includes(GamePlatform.WINDOWS) &&
               <ActionIcon variant="transparent">
                  <BrandWindows />
               </ActionIcon>
            }
            {bookmark.platforms && bookmark.platforms.includes(GamePlatform.LINUX) &&
               <ActionIcon variant="transparent">
                  <BrandSteam />
               </ActionIcon>
            }
            {bookmark.platforms && bookmark.platforms.includes(GamePlatform.MAC) &&
               <ActionIcon variant="transparent">
                  <BrandApple />
               </ActionIcon>
            }
            {bookmark.platforms && bookmark.platforms.includes(GamePlatform.SWITCH) &&
               <ActionIcon variant="transparent">
                  <DeviceNintendo />
               </ActionIcon>
            }
         </Group>
      </>
   );
}