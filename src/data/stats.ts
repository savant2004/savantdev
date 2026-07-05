export interface Stat {
  label: string;
  /** Numeric value for count-up. Omit when using `literal`. */
  value?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  /** When set, the value is shown literally (no count-up). */
  literal?: string;
}

export const ecosystemStats: Stat[] = [
  { label: 'Users', value: 10, suffix: 'K+' },
  { label: 'Uptime', value: 99.9, suffix: '%', decimals: 1 },
  { label: 'Apps', value: 3, suffix: '' },
  { label: 'Availability', literal: '24/7' },
  { label: 'Sync', literal: 'Realtime' },
];
