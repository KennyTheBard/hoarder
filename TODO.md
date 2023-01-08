# TODO

## Deployment
- [ ] use [`ttypescript` + `ttypescript-is`](https://stackoverflow.com/a/60824562) to validate request bodies
- [ ] create a `Dockerfile` for each service
- [ ] create `docker-compose.yml` for the entire project

## Features
- [ ] Add 'Refresh metadata' in bookmark card options
- [ ] "I feel lucky" option
- [ ] Add "protected" setting for bookmarks 
- [ ] Infinite scrolling
- [x] Reflect formdata changes in url query

## Improvements
- [ ] Expose image_url property for bookmark on editing/adding
- [ ] Add expiration for InMemoryCache
- [ ] Request for candidates only if current selected candidate is dropped
- [ ] Media Queries to make the site mobile friendly
- [ ] Use Sonic for fast search over database
- [ ] (Games) Search on steam for game metadata
- [ ] (Games) Add a new property for store_url
- [ ] Enable tag list button that redirects to all bookmarks with that tag 

## Issues
- [ ] Solve problem with steam images expiring

## Refactoring
- [ ] Create configuration directory
- [ ] Pagination + total + hasMore => Paginated