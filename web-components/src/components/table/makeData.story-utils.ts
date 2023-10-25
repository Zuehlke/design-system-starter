import { faker } from '@faker-js/faker/locale/de_CH';
import { WithSubRows } from './table.component';

const currencies = ['CHF', 'EUR', 'USD'] as const;
export type Currency = typeof currencies[number];

export interface Price {
  currency: Currency;
  amount: number;
}

const relationShipStatuses = ['relationship', 'complicated', 'single'] as const;
type RelationshipStatus = typeof relationShipStatuses[number];

export interface Person extends WithSubRows<Person> {
  id?: number;
  description?: string;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: RelationshipStatus;
  createdAt: Date;
  wealth: Price;
  company: string;
}

export const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

export const newPerson = (id?: number, withDescription?: boolean): Person => {
  return {
    id,
    description: withDescription ? faker.lorem.sentence(5) : undefined,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    age: faker.datatype.number(40),
    visits: faker.datatype.number(1000),
    progress: faker.datatype.number(100),
    createdAt: faker.datatype.datetime({ max: new Date().getTime() }),
    status: faker.helpers.shuffle<RelationshipStatus>([...relationShipStatuses])[0],
    company: faker.company.name(),
    wealth: {
      currency: faker.helpers.shuffle<Currency>([...currencies])[0],
      amount: faker.datatype.number({ min: -200_000, max: 1_000_000 }),
    },
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!;
    return range(len).map((): Person => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}

export interface ValuationRow {
  amount: number;
  description: string;
  value: number;
}

export interface ValuationHeader extends WithSubRows<ValuationHeader | ValuationRow> {
  amount: string;
  value: number;
}

export const valuationData: Array<ValuationHeader> = [
  {
    amount: 'Stocks',
    value: 8627850,
    subRows: [
      {
        amount: 'Energy',
        value: 881901,
        subRows: [
          {
            amount: 5000,
            description: 'CAMECO CORP (CA)',
            value: 136564,
          },
          {
            amount: 20000,
            description: 'SHELL PLC (NL)',
            value: 573435,
          },
        ],
      },
    ],
  },
  {
    amount: 'High Yield',
    value: 627850,
    subRows: [
      {
        amount: 750,
        description: 'EM Local Currency',
        value: 400200,
      },
      {
        amount: 28552,
        description: 'Global High Yield',
        value: 225120,
      },
    ],
  },
];
