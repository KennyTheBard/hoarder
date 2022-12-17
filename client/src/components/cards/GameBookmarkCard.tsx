import { ActionIcon, Group, Text } from '@mantine/core';
import { RocketOff, BrandWindows, DeviceNintendo, BrandApple, BrandSteam } from 'tabler-icons-react';
import { GameBookmark, GamePlatform } from 'common';


export function GameBookmarkCard(props: GameBookmark) {

   return (
      <>
         <Group position="apart">
            <Text>
               {props.title} ({props.launchDate || 'TBD'})
            </Text>
            {!props.isLaunched &&
               <ActionIcon variant="transparent">
                  <RocketOff />
               </ActionIcon>
            }
         </Group>
         <Group position="left" spacing={1}>
            {props.platforms && props.platforms.includes(GamePlatform.WINDOWS) &&
               <ActionIcon variant="transparent">
                  <BrandWindows />
               </ActionIcon>
            }
            {props.platforms && props.platforms.includes(GamePlatform.LINUX) &&
               <ActionIcon variant="transparent">
                  <BrandSteam />
               </ActionIcon>
            }
            {props.platforms && props.platforms.includes(GamePlatform.MAC) &&
               <ActionIcon variant="transparent">
                  <BrandApple />
               </ActionIcon>
            }
            {props.platforms && props.platforms.includes(GamePlatform.SWITCH) &&
               <ActionIcon variant="transparent">
                  <DeviceNintendo />
               </ActionIcon>
            }
         </Group>
      </>
   );
}