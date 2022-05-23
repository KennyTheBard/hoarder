import { SelectItem } from '@mantine/core';
import { BookmarkTypeSuggestion } from '../models';
import { BOOKMARK_TYPE_OPTIONS } from './constants';

export function getTypeOptions(suggestions: BookmarkTypeSuggestion[]): SelectItem[] {
   const suggestionDictionary: Record<string, number> = {};
   suggestions.forEach((suggestion) => suggestionDictionary[suggestion.type] = suggestion.confidence);

   const options = [
      ...BOOKMARK_TYPE_OPTIONS
   ];

   options.sort((option1, option2) => (suggestionDictionary[option2.value] || 0) - (suggestionDictionary[option1.value] || 0));
   return options;
}