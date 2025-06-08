import {ConditionOperator} from '@/types/condition-operator';
import {ResponseValue} from '@/types/response-value';

export interface SimpleCondition {
  questionId: string;
  operator: ConditionOperator;
  value: ResponseValue;
}
