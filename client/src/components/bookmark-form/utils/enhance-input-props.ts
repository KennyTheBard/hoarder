
export type GenericInputProps = {
   [x: string]: any;
   onChange: any;
   error: Record<string | number, React.ReactNode>[string | number];
}

export function enhanceInputProps(inputProps: GenericInputProps, customOnChange: (...args: any) => void): GenericInputProps {
   const originalOnChange = inputProps.onChange;
   return {
      ...inputProps,
      onChange: (event: any) => {
         customOnChange(event.target.value);
         if (originalOnChange) {
            originalOnChange(event);
         }
      } 
   }
}