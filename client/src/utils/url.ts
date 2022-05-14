export function isValidHttpUrl(s: string) {
   try {
      const url = new URL(s);
      return url.protocol === "http:" || url.protocol === "https:";
   } catch (e: any) {
      return false;
   }
}