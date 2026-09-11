import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

/**
 * SettingsPage destination. Business functionality (see Master Build
 * Prompt) is implemented in a later layer; Layer 0 only wires up the
 * navigation destination, route and translated title.
 */
export function SettingsPage() {
  return <PlaceholderPage titleKey="navigation.settings" icon="settings" />;
}
