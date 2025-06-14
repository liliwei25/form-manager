import {ConditionalAction} from './conditional-action';
import {Condition} from './condition';

export interface Conditional {
  action: ConditionalAction;
  targetPageId: string;
  condition: Condition;
}
