import { ActionIcon, Group, Popover, Text } from '@mantine/core';
import { BrandWindows, DeviceNintendo, BrandApple, BrandSteam, Magnet } from 'tabler-icons-react';
import { GameBookmark, GamePlatform } from 'common';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react';

export function GameBookmarkCard(props: GameBookmark) {

   const [isCopiedPopoverOpen, setCopiedPopoverOpen] = useState<boolean>(false);

   return (
      <>
         <Group position="apart">
            <Text>
               {props.title} {props.launchDate && `(${props.launchDate})`}
            </Text>
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
            {props.magnetUrl &&
               <CopyToClipboard text={props.magnetUrl}
                  onCopy={() => {
                     setCopiedPopoverOpen(true);
                     setTimeout(() => setCopiedPopoverOpen(false), 1000);
                  }}>
                  <Popover opened={isCopiedPopoverOpen} onChange={setCopiedPopoverOpen}>
                     <Popover.Target>
                        <ActionIcon>
                           <Magnet />
                        </ActionIcon>
                     </Popover.Target>

                     <Popover.Dropdown sx={{ backgroundColor: 'black', color: 'white' }}>
                        Magnet link copied to clipboard
                     </Popover.Dropdown>
                  </Popover>
               </CopyToClipboard>
            }
         </Group>
      </>
   );
}