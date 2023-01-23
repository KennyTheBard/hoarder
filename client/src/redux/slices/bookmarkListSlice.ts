import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { WithId, Bookmark, WithPagination, WithTotal, BookmarkSearchForm, FilterOperator, BookmarkType, Id } from 'common';
import { BOOKMARK_TYPE_OPTIONS, DEFAULT_PAGE_SIZE } from '../../utils';
import { getBookmarks, getRandomBookmark } from '../thunks';


export interface BookmarkSliceState {
   bookmarks: Record<Id, WithId<Bookmark>>;
   usedSearchForm: BookmarkSearchForm;
   bookmarksLoaded: number;
   bookmarksTotal?: number;
   loading: boolean;
   searchForm: BookmarkSearchForm;
}

const initialBookmarkSearchForm: BookmarkSearchForm = {
   isArchived: false,
   pagination: {
      limit: DEFAULT_PAGE_SIZE
   },
   tagsOperator: FilterOperator.OR,
}

export function searchParamsToBookmarkSearchForm(searchParams: URLSearchParams): BookmarkSearchForm {
   const searchForm: BookmarkSearchForm = JSON.parse(JSON.stringify(initialBookmarkSearchForm));
   searchForm.isArchived = searchParams.get('isArchived') === 'true';
   if (searchParams.get('tagsOperator') === FilterOperator.OR) {
      searchForm.tagsOperator = FilterOperator.OR;
   }
   if (searchParams.get('tagsOperator') === FilterOperator.AND) {
      searchForm.tagsOperator = FilterOperator.AND;
   }
   searchForm.searchTerm = searchParams.get('searchTerm') || undefined;
   const bookmarkTypes = BOOKMARK_TYPE_OPTIONS.map(op => op.value);
   searchForm.types = !!searchParams.get('types') ? searchParams.get('types')!.split(',').filter(type => bookmarkTypes.includes(type)) as BookmarkType[] : undefined;
   searchForm.tags = !!searchParams.get('tags') ? searchParams.get('tags')!.split(',') : undefined;
   return searchForm;
}

export function bookmarkSearchFormToSearchParams(searchForm: BookmarkSearchForm): URLSearchParams {
   const searchParams = new URLSearchParams();
   Object.keys(searchForm)
      .filter((propertyName: string): propertyName is keyof BookmarkSearchForm => propertyName !== 'pagination')
      .filter((propertyName: keyof BookmarkSearchForm) =>
         searchForm[propertyName] !== initialBookmarkSearchForm[propertyName])
      .forEach((propertyName: keyof BookmarkSearchForm) =>
         searchParams.set(propertyName, String(searchForm[propertyName]))
      );
   return searchParams;
}

const initialState: BookmarkSliceState = {
   bookmarks: {},
   bookmarksLoaded: 0,
   loading: false,
   usedSearchForm: initialBookmarkSearchForm,
   searchForm: initialBookmarkSearchForm,
};

export const bookmarkSlice = createSlice({
   name: 'bookmarkList',
   initialState,
   reducers: {
      bookmarksLoading(state: BookmarkSliceState) {
         state.loading = true;
      },
      setSearchForm(state: BookmarkSliceState, action: PayloadAction<BookmarkSearchForm>) {
         state.searchForm = action.payload;
      },
      setSearchTerm(state: BookmarkSliceState, action: PayloadAction<string>) {
         const searchTerm = action.payload;
         state.searchForm.searchTerm = searchTerm.length > 0 ? searchTerm : undefined;
      },
      setTypes(state: BookmarkSliceState, action: PayloadAction<BookmarkType[]>) {
         const types = action.payload;
         state.searchForm.types = types.length > 0 ? types : undefined;
      },
      setTags(state: BookmarkSliceState, action: PayloadAction<Id[]>) {
         const tags = action.payload;
         state.searchForm.tags = tags.length > 0 ? tags : undefined;
      },
      setTagsOperator(state: BookmarkSliceState, action: PayloadAction<FilterOperator>) {
         state.searchForm.tagsOperator = action.payload;
      },
      setShowArchived(state: BookmarkSliceState, action: PayloadAction<boolean>) {
         state.searchForm.isArchived = action.payload;
      },
      getNextPage(state: BookmarkSliceState, _action: PayloadAction<void>) {
         state.searchForm.pagination = {
            ...state.searchForm.pagination,
            skip: (state.searchForm.pagination.skip || 0) + DEFAULT_PAGE_SIZE
         };
      },
   },
   extraReducers: (builder) => builder
      .addCase(getBookmarks.fulfilled, extraReducerLoadBookmarks)
      .addCase(getRandomBookmark.fulfilled, extraReducerLoadBookmarks)
});

const extraReducerLoadBookmarks = (
   state: BookmarkSliceState,
   action: PayloadAction<{
      data: WithPagination<WithTotal<WithId<Bookmark>>>,
      searchForm: BookmarkSearchForm
   }>
) => {
   state.bookmarks = {
      ...(areSearchFormsConditionsEqual(action.payload.searchForm, state.usedSearchForm) ? state.bookmarks : {}),
      ...action.payload.data.entries.reduce((acc: Record<Id, WithId<Bookmark>>, entry: WithId<Bookmark>) => {
         acc[entry.id] = entry;
         return acc;
      }, {})
   };
   state.usedSearchForm = action.payload.searchForm;
   state.bookmarksLoaded = Object.values(state.bookmarks).length;
   state.bookmarksTotal = action.payload.data.total;
   state.loading = false;
};

const areSearchFormsConditionsEqual = (
   form1: BookmarkSearchForm,
   form2: BookmarkSearchForm
): boolean => {
   return JSON.stringify({
      ...form1,
      pagination: {
         limit: 0
      }
   }) === JSON.stringify({
      ...form2,
      pagination: {
         limit: 0
      }
   });
}

export const { bookmarksLoading, setSearchForm, setSearchTerm, setTypes, setTags, setTagsOperator, setShowArchived, getNextPage } = bookmarkSlice.actions;
// export { setShowArchived, getNextPage };
export const bookmarkSliceReducer: Reducer<typeof initialState> = bookmarkSlice.reducer;