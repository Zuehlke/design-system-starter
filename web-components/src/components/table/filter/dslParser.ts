const AND_OPERATOR = ',';
const OR_OPERATOR = ';';

const numeric = /[-+]?\d+(\.\d+)?/g;
const greaterThan = /^>/; //1
const greaterOrEqual = /^>=/; //2
const lessThan = /^</; //3
const lessOrEqual = /^<=/; //4
const equal = /^=/; //5
const notEqual = /^<>/; //6

export const operators = {
  equals: '=',
  greaterThanOrEqualTo: '>=',
  lessThanOrEqualTo: '<=',
  not: '<>',
  greaterThan: '>',
  lessThan: '<',
  complex: '',
} as const;
export type OperatorKey = keyof typeof operators;
export const operatorKeys = Object.keys(operators) as OperatorKey[];
type Operator = typeof operators[keyof typeof operators];

function parseSingleIntervalExpression(exp: string) {
  let min = Number.NEGATIVE_INFINITY;
  let max = Number.POSITIVE_INFINITY;
  let not = Number.NaN;
  let strictLower = true;
  let strictUpper = true;
  const complex = exp.includes(AND_OPERATOR);

  exp.split(AND_OPERATOR).forEach(member => {
    const operator: Operator | '' =
      notEqual.test(member)
        ? operators.not
        : equal.test(member)
          ? operators.equals
          : lessOrEqual.test(member)
            ? operators.lessThanOrEqualTo
            : lessThan.test(member)
              ? operators.lessThan
              : greaterOrEqual.test(member)
                ? operators.greaterThanOrEqualTo
                : greaterThan.test(member)
                  ? operators.greaterThan
                  : '';

    const matchedOperand = member.match(numeric);
    if (operator && matchedOperand) {
      const operand = matchedOperand[0];
      const operatorPosition = member.search(operator);
      const operandPosition = member.search(operand[0] || '');
      const operandToNumeric = parseFloat(operand);

      switch (operator) {
        case '>':
          if (operandPosition < operatorPosition) {
            max = (operandToNumeric < max ? operandToNumeric : max);
          } else {
            min = (operandToNumeric > min ? operandToNumeric : min);
          }
          break;
        case '>=':
          if (operandPosition < operatorPosition) {
            max = operandToNumeric < max ? operandToNumeric : max;
          } else {
            min = operandToNumeric > min ? operandToNumeric : min;
          }
          strictLower = false;
          break;
        case '<':
          if (operandPosition < operatorPosition) {
            min = (operandToNumeric > min ? operandToNumeric : min);
          } else {
            max = (operandToNumeric < max ? operandToNumeric : max);
          }
          break;
        case '<=':
          if (operandPosition < operatorPosition) {
            min = operandToNumeric > min ? operandToNumeric : min;
          } else {
            max = operandToNumeric < max ? operandToNumeric : max;
          }
          strictUpper = false;
          break;
        case '=':
          min = operandToNumeric;
          max = operandToNumeric;
          strictUpper = false;
          strictLower = false;
          break;
        case '<>':
          not = operandToNumeric;
          break;
      }
    } else {
      throw new Error('Invalid input');
    }
  });

  return {
    lower: min !== Number.NEGATIVE_INFINITY ? min : undefined,
    upper: max !== Number.POSITIVE_INFINITY ? max : undefined,
    strictLower: strictLower,
    strictUpper: strictUpper,
    not: not,
    complex: complex,
  };
}

export function parseDSL(exp: string) {
  if (exp === undefined || exp.trim() === '') {
    return undefined;
  }

  return {
    bands: exp
      .split(OR_OPERATOR)
      .map(parseSingleIntervalExpression),
  };
}
