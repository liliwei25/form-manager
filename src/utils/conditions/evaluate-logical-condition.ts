import { LogicalCondition } from '@/types/logical-condition'
import { LogicalOperator } from '@/types/logical-operator'
import { Response } from '@/types/response'

import { evaluateCondition } from '@/utils/conditions/evaluate-condition'

export const evaluateLogicalCondition = (
  condition: LogicalCondition,
  responses: Response
): boolean => {
  if (condition.conditions.length === 0) return false
  if (condition.type === LogicalOperator.AND) {
    return condition.conditions.every((subCondition) => evaluateCondition(subCondition, responses))
  }
  return condition.conditions.some((subCondition) => evaluateCondition(subCondition, responses))
}
