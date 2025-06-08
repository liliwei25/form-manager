import {Condition} from '@/types/condition';

import {LogicalOperator} from '@/types/logical-operator';

export interface LogicalCondition {
  type: LogicalOperator;
  conditions: Condition[];
}
