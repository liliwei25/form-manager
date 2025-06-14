import {Condition} from './condition';
import {LogicalOperator} from './logical-operator';

export interface LogicalCondition {
  type: LogicalOperator;
  conditions: Condition[];
}
