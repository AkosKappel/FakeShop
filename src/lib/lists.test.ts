import { describe, expect, it } from 'vitest';

import { pickByIds, toggleId } from './lists';

describe('toggleId', () => {
  it('adds, removes and stops at the limit', () => {
    expect(toggleId([1, 2], 3, 3)).toEqual([1, 2, 3]);
    expect(toggleId([1, 2, 3], 2, 3)).toEqual([1, 3]);
    expect(toggleId([1, 2, 3], 4, 3)).toEqual([1, 2, 3]);
  });
});

describe('pickByIds', () => {
  it('keeps the order of the ids and skips unknown ones', () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(pickByIds(items, [3, 9, 1])).toEqual([{ id: 3 }, { id: 1 }]);
  });
});
