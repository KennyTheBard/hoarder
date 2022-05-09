# hoarder
A better alternative than managing your links and messages in chat rooms with yourself

## TODO

- [ ] use [`ttypescript` + `ttypescript-is`](https://stackoverflow.com/a/60824562) to validate request bodies
- [x] use redux for client state management
- [ ] create a `Dockerfile` for each service
- [ ] create `docker-compose.yml` for the entire project
- [x] add a proxy for URL metadata retrieveal (inside the server)
- [ ] refactor add forms to be reusable for edit forms as well
- [x] retrieve suggestions for title (with URL metadata)
- [ ] Media Queries to make the side mobile friendly
- [ ] expose endpoints
  - [ ] bookmarks 
    - [x] save bookmark
    - [x] delete bookmark
    - [x] update bookmark
    - [ ] get bookmarks + filters
  - [ ] tags
    - [x] create tags
    - [x] get all tags
    - [x] delete tag
    - [ ] edit tag 
  - [ ] get URL suggestions
    - [x] get metadata
    - [ ] IMDB suggestions
    - [ ] steam or how long to beat suggestions
    - [ ] MyAnimeList suggestions
- [ ] autofill form fields based on URL metadata
- [x] replace modal slice with ModalManager