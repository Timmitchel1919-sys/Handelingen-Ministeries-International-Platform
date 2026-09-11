import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

/**
 * MinistriesPage destination. Business functionality (see Master Build
 * Prompt) is implemented in a later layer; Layer 0 only wires up the
 * navigation destination, route and translated title.
 */
export function MinistriesPage() {
  return <PlaceholderPage titleKey="navigation.ministries" icon="ministries" />;
}
