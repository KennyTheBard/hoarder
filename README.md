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
- [ ] Add tag colors
- [ ] Create configuration directory
- [x] Have candidates include an object with overridding properties, in case they are chosen
- [ ] Request for candidates only if current metadata is dropped
- [ ] Cache responses from server for metadata & candidates
- [ ] Explicit ask for each bookmark field that would be replaced, but only if it has data already
- [ ] Replace delete with archive and add an arhive page
- [ ] Add a plaintext type