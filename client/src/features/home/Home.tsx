import { Button, Center, Container, Input, Space, Stack } from '@mantine/core';
import { Search } from 'tabler-icons-react';
import { useAppDispatch } from '../../redux/hooks';
import { getBookmarks } from '../../redux/slices';
import { useEffect } from 'react';
import { BoardFeed } from './feed';

export function Home() {

   // const entries: Bookmark[] = [{
   //    url: 'https://medium.com/edonec/creating-a-generic-component-with-react-typescript-2c17f8c4386e',
   //    hostname: 'medium.com',
   //    title: 'text',
   //    type: 'article',
   //    tags: ['react', 'generic'],
   //    createdTimestamp: new Date().getTime(),
   //    updatedTimestamp: new Date().getTime()
   // }, {
   //    content: 'This is a text article',
   //    type: 'text',
   //    tags: ['react', 'generic'],
   //    createdTimestamp: new Date().getTime(),
   //    updatedTimestamp: new Date().getTime()
   // }, {
   //    url: 'https://www.youtube.com/watch?v=Dr5a0L4GxZo',
   //    title: 'KnightTrek Productions 20 Years Old',
   //    hostname: 'youtube',
   //    lengthInSeconds: 783,
   //    type: 'video',
   //    tags: ['react', 'generic'],
   //    createdTimestamp: new Date().getTime(),
   //    updatedTimestamp: new Date().getTime()
   // }, {
   //    title: 'Skyscraper',
   //    isOnNetflix: true,
   //    imdbUrl: 'https://www.imdb.com/title/tt5758778',
   //    imdbRating: 5.8,
   //    premiered: true,
   //    premieredYear: 2011,
   //    type: 'movie',
   //    tags: ['react', 'generic'],
   //    createdTimestamp: new Date().getTime(),
   //    updatedTimestamp: new Date().getTime()
   // }, {
   //    title: 'The Leftovers',
   //    isOnNetflix: true,
   //    imdbUrl: 'https://www.imdb.com/title/tt2699128',
   //    imdbRating: 8.3,
   //    premiered: true,
   //    premieredYear: 2014,
   //    finished: true,
   //    finishedYear: 2017,
   //    seasonCount: 3,
   //    type: 'show',
   //    tags: ['react', 'generic'],
   //    createdTimestamp: new Date().getTime(),
   //    updatedTimestamp: new Date().getTime()
   // }, {
   //    title: 'Fairy Tail',
   //    isOnNetflix: false,
   //    myAnimeListUrl: 'https://myanimelist.net/anime/6702/Fairy_Tail',
   //    myAnimeListScore: 7.59,
   //    myAnimeListReviewCount: 926705,
   //    premiered: true,
   //    premieredYear: 2009,
   //    finished: true,
   //    finishedYear: 2013,
   //    isAdaptation: true,
   //    episodeCount: 175,
   //    type: 'anime',
   //    tags: ['react', 'generic'],
   //    createdTimestamp: new Date().getTime(),
   //    updatedTimestamp: new Date().getTime()
   // }, {
   //    url: 'https://store.steampowered.com/app/3830/Psychonauts/',
   //    title: 'Psychonauts',
   //    published: true,
   //    publishedYear: 2005,
   //    platforms: [
   //       GamePlatform.WINDOWS,
   //       GamePlatform.LINUX,
   //       GamePlatform.MAC
   //    ],
   //    reviews: [{
   //       source: 'steam',
   //       recentReviews: 'Overwhelmingly Positive',
   //       recentReviewsCount: 138,
   //       allReviews: 'Overwhelmingly Positive',
   //       allReviewsCount: 8403,
   //    }, {
   //       source: 'gog',
   //       overall: 4.7,
   //       verifiedOwners: 4.4,
   //       filtersBased: 4.5,
   //    }],
   //    type: 'game',
   //    tags: ['react', 'generic'],
   //    createdTimestamp: new Date().getTime(),
   //    updatedTimestamp: new Date().getTime()
   // }];

   const dispatch = useAppDispatch();

   const updateBookmarks = () => {
      dispatch(getBookmarks());
   }
   useEffect(updateBookmarks, []);

   return (
      <>
         <Container size="xl">
            <Stack>
               <Space h={50} />
               <Center>
                  <Input
                     icon={<Search size={16} />}
                     placeholder="Search..."
                  />
                  <Button onClick={() => dispatch(getBookmarks())}>
                     Refresh
                  </Button>
               </Center>
               <Space h={20} />
               <BoardFeed columnCount={4} />
               {/* TODO: add loading more spinner or "that's all" */}
               <Space h={100} />
            </Stack>
         </Container>
      </>
   );
}