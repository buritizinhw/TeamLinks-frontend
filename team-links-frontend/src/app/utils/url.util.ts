export function normalizeUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function guessName(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    return hostname.split('.')[0] || 'Link';
  } catch {
    return 'Link';
  }
}
