import { Condition } from '../../types/condition'
import { Response } from '../../types/response'

import { evaluateLogicalCondition } from './evaluate-logical-condition'
import { evaluateSimpleCondition } from './evaluate-simple-condition'
import { isLogicalCondition } from './is-logical-condition'

export const evaluateCondition = (condition: Condition, responses: Response): boolean => {
  return isLogicalCondition(condition)
    ? evaluateLogicalCondition(condition, responses)
    : evaluateSimpleCondition(condition, responses)
}
