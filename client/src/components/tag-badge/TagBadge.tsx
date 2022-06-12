import { Badge, MantineSize } from '@mantine/core';


export type TagBadgeProps = {
   size?: MantineSize;
   name: string;
   variant: 'light' | 'filled';
   color: string;
}

export function TagBadge(props: TagBadgeProps) {
   return (
      <Badge
         size={props.size ? props.size : "md"}
         variant={props.variant}
         color={props.color}
      >
         {props.name}
      </Badge>
   );
}