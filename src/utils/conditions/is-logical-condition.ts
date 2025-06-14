import { Condition } from '../../types/condition'
import { LogicalCondition } from '../../types/logical-condition'

import { isLogicalOperator } from './is-logical-operator'

export const isLogicalCondition = (condition: Condition): condition is LogicalCondition => {
  const conditionType = (condition as LogicalCondition).type
  return isLogicalOperator(conditionType)
}
