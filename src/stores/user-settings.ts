import { defineStore } from 'pinia';
import { ref } from 'vue';
import { UserQuickLink } from '@/utils/types';
import { tryParseJSON } from '@/utils/util';

const MAX_CUSTOM_LINKS = 10;

function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

function normalizeCustomLinks(value: unknown): UserQuickLink[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((link): link is UserQuickLink => (
      !!link
      && typeof link === 'object'
      && typeof link.id === 'string'
      && typeof link.name === 'string'
      && typeof link.url === 'string'
      && typeof link.pinnedToHome === 'boolean'
      && typeof link.order === 'number'
      && !!link.name.trim()
      && isValidHttpUrl(link.url.trim())
    ))
    .sort((a, b) => a.order - b.order)
    .slice(0, MAX_CUSTOM_LINKS)
    .map((link, index) => ({
      ...link,
      name: link.name.trim().slice(0, 24),
      url: link.url.trim().slice(0, 200),
      order: index,
    }));
}

export default defineStore('grades', () => {
  const grade = ref('None');
  const showPWCSchedule = ref(true);
  const customLinks = ref<UserQuickLink[]>([]);

  function initializeGrade(): void {
    if (localStorage.grade) {
      setGrade(localStorage.grade);
    }
  }

  function initializeShowPWCSchedule(): void {
    if (localStorage.showPWCSchedule) {
      setShowPWCSchedule(localStorage.showPWCSchedule === 'true');
    }
  }

  function initializeCustomLinks(): void {
    if (localStorage.customLinks) {
      setCustomLinks(tryParseJSON(localStorage.customLinks));
    }
  }

  function setGrade(value: string): void {
    grade.value = value;
    localStorage.grade = value;
  }

  function setShowPWCSchedule(value: boolean): void {
    showPWCSchedule.value = value;
    localStorage.showPWCSchedule = value;
  }

  function setCustomLinks(value: unknown): void {
    customLinks.value = normalizeCustomLinks(value);
    localStorage.customLinks = JSON.stringify(customLinks.value);
  }

  function addCustomLink({
    name,
    url,
    pinnedToHome,
  }: { name: string; url: string; pinnedToHome: boolean }): void {
    if (customLinks.value.length >= MAX_CUSTOM_LINKS) return;

    const trimmedName = name.trim().slice(0, 24);
    const trimmedUrl = url.trim().slice(0, 200);
    if (!trimmedName || !isValidHttpUrl(trimmedUrl)) return;

    setCustomLinks([
      ...customLinks.value,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: trimmedName,
        url: trimmedUrl,
        pinnedToHome,
        order: customLinks.value.length,
      },
    ]);
  }

  function updateCustomLink({
    id,
    name,
    url,
    pinnedToHome,
  }: { id: string; name: string; url: string; pinnedToHome: boolean }): void {
    const trimmedName = name.trim().slice(0, 24);
    const trimmedUrl = url.trim().slice(0, 200);
    if (!trimmedName || !isValidHttpUrl(trimmedUrl)) return;

    setCustomLinks(customLinks.value.map((link) => {
      if (link.id !== id) return link;
      return {
        ...link,
        name: trimmedName,
        url: trimmedUrl,
        pinnedToHome,
      };
    }));
  }

  function removeCustomLink(id: string): void {
    setCustomLinks(customLinks.value.filter((link) => link.id !== id));
  }

  function moveCustomLink({ id, direction }: { id: string; direction: -1 | 1 }): void {
    const currentIndex = customLinks.value.findIndex((link) => link.id === id);
    if (currentIndex === -1) return;
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= customLinks.value.length) return;

    const movedLinks = [...customLinks.value];
    const [selectedLink] = movedLinks.splice(currentIndex, 1);
    movedLinks.splice(targetIndex, 0, selectedLink);
    setCustomLinks(movedLinks);
  }

  return {
    grade,
    showPWCSchedule,
    customLinks,
    initializeGrade,
    initializeShowPWCSchedule,
    initializeCustomLinks,
    setGrade,
    setShowPWCSchedule,
    setCustomLinks,
    addCustomLink,
    updateCustomLink,
    removeCustomLink,
    moveCustomLink,
  };
});
