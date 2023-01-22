import { Checkbox, SelectItem } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { BOOKMARK_TYPE_OPTIONS } from '../../utils';


export function BookmarkTypesChecklist() {
   const [values, handlers] = useListState(BOOKMARK_TYPE_OPTIONS.map((option: SelectItem) => ({
      label: `Export '${option.label}'`,
      key: option.value,
      checked: true
   })));

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