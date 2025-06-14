import { LogicalOperator } from '../../types/logical-operator'

export const isLogicalOperator = (operator: unknown): operator is LogicalOperator =>
  Object.values(LogicalOperator).includes(operator as LogicalOperator)
