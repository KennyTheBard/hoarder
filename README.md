# hoarder
A better alternative than managing your links and messages in chat rooms with yourself

## TODO

- [ ] use [`ttypescript` + `ttypescript-is`](https://stackoverflow.com/a/60824562) to validate request bodies
- [x] use redux for client state management
- [ ] create a `Dockerfile` for each service
- [ ] create `docker-compose.yml` for the entire project
- [x] add a proxy for URL metadata retrieveal (inside the server)
- [x] retrieve suggestions for title (with URL metadata)
- [ ] Media Queries to make the side mobile friendly
- [x] autofill form fields based on URL metadata
- [x] replace modal slice with ModalManager
- [ ] Add 'Refresh metadata' in bookmark card options
- [x] Add tag colors
- [ ] Create configuration directory
- [x] Have candidates include an object with overridding properties, in case they are chosen
- [ ] Request for candidates only if current selected candidate is dropped
- [x] Cache responses from server for metadata & candidates
- [x] Replace delete with archive and add an arhive page
- [x] Add a plaintext type
- [x] Auto-select newly added tag
- [ ] Fix repeated requests (such as isUrlAlreadyBooked) when fields are changing (in this case title)
- [ ] Add expiration for InMemoryCache
- [ ] Update preview tags with newly added tag
- [ ] "Cannot convert undefined or null to object" on {"type":"game","title":"masochisia"}
- [x] "Request path contains unescaped characters" on {"type":"book","title":"Harap Alb continuă"}
- [x] Add Board Game category
- [ ] Expose image_url property for bookmark on editing/adding
- [x] Pagination
- [ ] infinite scrolling
- [ ] Solve problem with steam images expiring
- [x] Url already booked on edit
- [ ] Icons in tags
- [ ] Icon to show that there is an URL if there is no image
- [x] Editing to add new tag overrides existing tags
- [ ] Loading metadata overrides input even if metadata field is empty
- [ ] Use Sonic for fast search over database
- [x] Fix "TypeError: Cannot destructure property 'images' of 'metadata' as it is null."
- [ ] "I feel lucky" option
- [x] Button for "Back to start"
- [ ] Fix "TypeError: Tag is undefined" (Uncaught TypeError: tag is undefined
    BookmarkCard BookmarkCard.tsx:186
    BookmarkCard BookmarkCard.tsx:183)