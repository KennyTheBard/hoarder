import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { Card, Center } from '@mantine/core';
import { ArticleBookmark } from '../../models/bookmark';

export interface ArticleBookmarkCardProps {
   bookmark: ArticleBookmark
}

export function ArticleBookmarkCard(props: ArticleBookmarkCardProps) {
   const bookmark = props.bookmark;

   return (
      <Card.Section>
         <Center>
            <LinkPreview url={bookmark.url} imageHeight={150} width={300} descriptionLength={35} />
         </Center>
      </Card.Section>
   );
}