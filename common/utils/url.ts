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
   const matches = Array.from(s.matchAll(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g));
   return matches.map(match => ({
      text: match[0],
      index: match['index']
   }));
}

