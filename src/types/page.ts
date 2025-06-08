import {Question} from '@/types/question';
import {Conditional} from '@/types/conditional';

export interface Page {
  id: string;
  title?: string;
  description?: string;
  questions: Question[];
  conditionals?: Conditional[];
}
