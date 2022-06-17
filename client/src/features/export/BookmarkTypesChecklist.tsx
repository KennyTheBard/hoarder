import { Checkbox } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { BookmarkType } from 'common';


const initialValues = [
   { label: 'Export articles', checked: true, key: BookmarkType.ARTICLE },
   { label: 'Export tools', checked: true, key: BookmarkType.TOOL },
   { label: 'Export videos', checked: true, key: BookmarkType.VIDEO },
   { label: 'Export movies', checked: true, key: BookmarkType.MOVIE },
   { label: 'Export shows', checked: true, key: BookmarkType.SHOW },
   { label: 'Export animes', checked: true, key: BookmarkType.ANIME },
   { label: 'Export games', checked: true, key: BookmarkType.GAME },
];

export function BookmarkTypesChecklist() {
   const [values, handlers] = useListState(initialValues);

   const allChecked = values.every((value) => value.checked);
   const indeterminate = values.some((value) => value.checked) && !allChecked;

   const items = values.map((value, index) => (
      <Checkbox
         mt="xs"
         ml={33}
         label={value.label}
         key={value.key}
         checked={value.checked}
         onChange={(event) => handlers.setItemProp(index, 'checked', event.currentTarget.checked)}
      />
   ));

   return (
      <>
         <Checkbox
            checked={allChecked}
            indeterminate={indeterminate}
            label="Export all bookmarks"
            transitionDuration={0}
            onChange={() =>
               handlers.setState((current) =>
                  current.map((value) => ({ ...value, checked: !allChecked }))
               )
            }
         />
         {items}
      </>
   );
}