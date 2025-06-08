import { ConditionOperator } from '@/types/condition-operator'
import { SimpleCondition } from '@/types/simple-condition'
import { Response } from '@/types/response'
import {BasicResponseValue} from '@/types';

export const evaluateSimpleCondition = (
  condition: SimpleCondition,
  responses: Response,
): boolean => {
  const { questionId, operator, value } = condition

  const response = responses[questionId]
  if (response === undefined) return false

  if (operator === ConditionOperator.EQ) {
    return response === value
  }
  if (operator === ConditionOperator.NEQ) {
    return response !== value
  }
  if (operator === ConditionOperator.CONTAINS) {
    return Array.isArray(response)
      ? response.includes(value as BasicResponseValue)
      : String(response).includes(String(value))
  }
  const numericValue = Number(value)
  const numericResponse = Number(response)

  if (Number.isNaN(numericResponse)) {
    return false
  }

  switch (operator) {
    case ConditionOperator.GT:
      return numericResponse > numericValue
    case ConditionOperator.LT:
      return numericResponse < numericValue
    case ConditionOperator.GTE:
      return numericResponse >= numericValue
    case ConditionOperator.LTE:
      return numericResponse <= numericValue
    default:
      return false
  }
}
