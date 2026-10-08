/*
  Checks for the student's own links (no Vue here, so it is easy to test:
  tests/home-links.test.ts).

  Links are only ever stored and shown on the device of the student who
  adds them, so there is no list of allowed sites. What is checked is that
  it really is a web address: anything that isn't http(s) (javascript:,
  data:, file:...) is refused, because a link like that could run code on
  the page instead of opening a site.
*/

// "forms.gle/abc" -> "https://forms.gle/abc"; null if it isn't a usable web link
export function normalizeUrl(input: string): string | null {
  let text = input.trim();
  if (!text || /\s/.test(text)) return null;

  // no scheme typed: assume a normal secure web address. "site.org:8443/x" is a
  // host and port, not a scheme, so a colon followed by a digit doesn't count.
  if (!/^[a-z][a-z\d+.-]*:(?!\d)/i.test(text)) text = `https://${text.replace(/^\/+/, '')}`;

  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  // needs a real host name ("docs.google.com"), not "https://hello"
  if (!/^[^.]+(\.[^.]+)+$/.test(url.hostname) || url.username || url.password) return null;

  return url.href;
}

// "https://www.forms.gle/abc" -> "forms.gle"
export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export type LinkKind = 'form' | 'classroom' | 'doc' | 'calendar' | 'video' | 'link';

// what sort of page it is, to pick an icon
export function kindOf(url: string): LinkKind {
  let host = '';
  let path = '';
  try {
    const parsed = new URL(url);
    host = parsed.hostname.replace(/^www\./, '');
    path = parsed.pathname;
  } catch {
    return 'link';
  }

  if (host === 'forms.gle' || (host === 'docs.google.com' && path.startsWith('/forms')) || host.endsWith('forms.office.com')) return 'form';
  if (host === 'classroom.google.com' || host.includes('instructure.com') || host.includes('canvas')) return 'classroom';
  if (host === 'docs.google.com' || host === 'drive.google.com' || host === 'sites.google.com') return 'doc';
  if (host === 'calendar.google.com' || host.includes('calendly.com') || host.includes('youcanbook.me')) return 'calendar';
  if (host.endsWith('youtube.com') || host === 'youtu.be') return 'video';
  return 'link';
}
