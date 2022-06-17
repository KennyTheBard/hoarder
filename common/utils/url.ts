export function isValidHttpUrl(s: string) {
   try {
      const url = new URL(s);
      return url.protocol === "http:" || url.protocol === "https:";
   } catch (e: any) {
      return false;
   }
}

export function getHostnameForUrl(url: string): string {
   try {
      const { hostname } = new URL(url);
      return hostname;
   } catch (err) {
      console.error(err);
      return '';
   }
}