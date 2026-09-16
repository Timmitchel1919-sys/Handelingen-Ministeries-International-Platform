import type { Church } from '@/types/church';

const STORAGE_KEY = 'hmi.selectedChurchId';

export function getSelectedChurchId(): string | null {
  try { return window.sessionStorage.getItem(STORAGE_KEY) ?? window.sessionStorage.getItem('handelingen.selectedChurchId'); } catch { return null; }
}

export function setSelectedChurchId(churchId: string): void {
  try { window.sessionStorage.setItem(STORAGE_KEY, churchId); } catch { /* Storage may be unavailable. */ }
}

export function clearSelectedChurchId(): void {
  try { window.sessionStorage.removeItem(STORAGE_KEY); window.sessionStorage.removeItem('handelingen.selectedChurchId'); } catch { /* Storage may be unavailable. */ }
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
