# TODO

## Deployment
- [ ] use [`ttypescript` + `ttypescript-is`](https://stackoverflow.com/a/60824562) to validate request bodies
- [x] create a `Dockerfile`
- [x] create `docker-compose.yml` for the entire project

## Features
- [ ] Add 'Refresh metadata' in bookmark card options
- [x] "I feel lucky" option
- [ ] Add "protected" setting for bookmarks 
- [x] Infinite scrolling
- [x] Reflect formdata changes in url query
- [x] Send to Telegram

## Improvements
- [ ] Expose image_url property for bookmark on editing/adding
- [ ] Add expiration for InMemoryCache
- [ ] Request for candidates only if current selected candidate is dropped
- [ ] Media Queries to make the site mobile friendly
- [ ] Use Sonic for fast search over database
- [ ] (Games) Search on steam for game metadata
- [ ] (Games) Add a new property for store_url
- [x] Enable tag list button that redirects to all bookmarks with that tag 

## Issues
- [ ] Expired Steam image URLs
- [ ] MultiSelect inputs keep the first value inserted after all are deleted (even if the first one was deleted before)

## Refactoring
- [ ] Create configuration directory
- [ ] Pagination + total + hasMore => Paginated