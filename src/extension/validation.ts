import { Rule } from '../nodecg/generated'

export const validationRule = (rule: Rule): boolean => {

  if (!(rule.players === 3 || rule.players === 4)) {
    return false;
  }

  if (!(rule.years > 0 && rule.years < 101)) {
    return false;
  }

  return true;
}
