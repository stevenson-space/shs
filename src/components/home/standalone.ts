import { readonly, ref } from 'vue';

/*
  True when the site is running as an installed app (added to the home
  screen), so the Install shortcut can step aside, the same way the old
  Install card did.
*/
const standalone = ref(false);

if (typeof window !== 'undefined' && window.matchMedia) {
  const query = window.matchMedia('(display-mode: standalone)');
  standalone.value = query.matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

  const onChange = (event: MediaQueryListEvent) => { standalone.value = event.matches; };
  if (query.addEventListener) {
    query.addEventListener('change', onChange);
  } else {
    query.addListener(onChange);
  }
}

export const isStandalone = readonly(standalone);
