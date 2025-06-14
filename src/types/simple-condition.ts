import { ConditionOperator } from './condition-operator';
import { ResponseValue } from './response-value';

export interface SimpleCondition {
  questionId: string;
  operator: ConditionOperator;
  value: ResponseValue;
}
