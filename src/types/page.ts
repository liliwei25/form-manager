import {Question} from './question';
import {Conditional} from './conditional';

export interface Page {
  id: string;
  title?: string;
  description?: string;
  questions: Question[];
  conditionals?: Conditional[];
}
