import { IsoStringDateAdapter } from './iso-date-adapter';

describe('IsoStringDateAdapter', () => {
  const adapter = new IsoStringDateAdapter();

  it('parses an ISO string into a date struct', () => {
    expect(adapter.fromModel('2023-08-03')).toEqual({ year: 2023, month: 8, day: 3 });
  });

  it('formats a date struct as an ISO string, padding month and day', () => {
    expect(adapter.toModel({ year: 2024, month: 1, day: 5 })).toBe('2024-01-05');
  });

  it('round-trips a value unchanged', () => {
    expect(adapter.toModel(adapter.fromModel('2015-05-19'))).toBe('2015-05-19');
  });

  it('maps empty values to null in both directions', () => {
    expect(adapter.fromModel(null)).toBeNull();
    expect(adapter.fromModel('')).toBeNull();
    expect(adapter.toModel(null)).toBeNull();
  });
});
