import type { Church } from '@/types/church';

const STORAGE_KEY = 'handelingen.selectedChurchId';

export function getSelectedChurchId(): string | null {
  return window.sessionStorage.getItem(STORAGE_KEY);
}

export function setSelectedChurchId(churchId: string): void {
  window.sessionStorage.setItem(STORAGE_KEY, churchId);
}

export function clearSelectedChurchId(): void {
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function storeSelectedChurch(church: Church): void {
  setSelectedChurchId(church.id);
}

export function getSelectedChurch(): {
  churchId: string | null;
} {
  return {
    churchId: getSelectedChurchId(),
  };
}