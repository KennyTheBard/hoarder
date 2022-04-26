import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { Card, Center } from '@mantine/core';
import { ArticleBookmark } from '../../models/bookmark';

export interface ArticleBookmarkCardContentProps {
   bookmark: ArticleBookmark
}

export function ArticleBookmarkCardContent(props: ArticleBookmarkCardContentProps) {
   return (
      <Card.Section>
         <Center>
            <LinkPreview url={props.bookmark.url} imageHeight={150} width={300} descriptionLength={35} />
         </Center>
      </Card.Section>
   )
}