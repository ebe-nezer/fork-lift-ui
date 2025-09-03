export function getAPIUrl(url: string) {
  const addr = new URL(url);
  const hostname = addr.hostname;
  const protocol = addr.protocol;
  return `${protocol}//${hostname}`;
}
