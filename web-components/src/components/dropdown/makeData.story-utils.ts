import { newPerson, range } from '../table/makeData.story-utils';

export function makeData(count: number) {
  return range(count).map((_, idx) => {
    return {
      ...newPerson(idx, true),
    };
  });
}
