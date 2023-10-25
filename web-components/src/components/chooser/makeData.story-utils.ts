import { SearchCategory } from './chooser.component';
import { newPerson, range } from '../table/makeData.story-utils';


export function makeChooserData(count: number) {
  return range(count).map((_, idx) => {
    return {
      ...newPerson(idx, true),
    };
  });
}

export function makeReducedBankFilterCategories(): SearchCategory[] {
  return [
    {
      fieldName: 'Partner Nr.',
      fieldVal: 'partnerNumber',
    },
    {
      fieldName: 'Kurzbeschreibung',
      fieldVal: 'kurzBeschreibung',
    },
    {
      fieldName: 'Währung',
      fieldVal: 'waehrung',
    },
  ];
}

export function makeBankFilterCategories(): SearchCategory[] {
  return [
    {
      fieldName: 'Partner Nr.',
      fieldVal: 'partnerNumber',
    },
    {
      fieldName: 'Kurzbeschreibung',
      fieldVal: 'kurzBeschreibung',
    },
    {
      fieldName: 'Währung',
      fieldVal: 'waehrung',
    },
    {
      fieldName: 'Kontoart',
      fieldVal: 'kontoart',
    },
    {
      fieldName: 'Laufzeit',
      fieldVal: 'laufzeit',
    },
    {
      fieldName: 'Verfall',
      fieldVal: 'verfall',
    },
  ];
}

