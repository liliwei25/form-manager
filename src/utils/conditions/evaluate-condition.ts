import { Condition } from '@/types/condition'
import { Response } from '@/types/response'

import { evaluateLogicalCondition } from '@/utils/conditions/evaluate-logical-condition'
import { evaluateSimpleCondition } from '@/utils/conditions/evaluate-simple-condition'
import { isLogicalCondition } from '@/utils/conditions/is-logical-condition'

export const evaluateCondition = (condition: Condition, responses: Response): boolean => {
  return isLogicalCondition(condition)
    ? evaluateLogicalCondition(condition, responses)
    : evaluateSimpleCondition(condition, responses)
}
