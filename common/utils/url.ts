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


export function findHttpUrls(s: string): {text: string, index: number}[] {
   const matches = Array.from(s.matchAll(/(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g));
   return matches.map(match => ({
      text: match[0],
      index: match['index']
   }));
}

