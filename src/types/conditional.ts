import {ConditionalAction} from '@/types/conditional-action';
import {Condition} from '@/types/condition';

export interface Conditional {
  action: ConditionalAction;
  targetPageId: string;
  condition: Condition;
}
