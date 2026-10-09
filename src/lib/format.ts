const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 0,
});

const longDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' });
const shortDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});

const plurals = new Intl.PluralRules('en-US');

export const formatPrice = (value: number) => currency.format(value);

export const formatPercent = (value: number) => percent.format(value / 100);

export const formatDate = (value: string | Date) =>
  longDate.format(new Date(value));

export const formatShortDate = (value: Date) => shortDate.format(value);

export function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${plurals.select(count) === 'one' ? singular : plural}`;
}

/** "GB" → 🇬🇧: each letter maps to a regional indicator symbol. */
export function flagEmoji(regionCode: string): string {
  return String.fromCodePoint(
    ...[...regionCode.toUpperCase()].map(
      (letter) => 0x1f1e6 + letter.charCodeAt(0) - 65
    )
  );
}
