import { QuestionType } from './question-type';
import { ResponseValue } from './response-value';
import { Validation } from './validation';

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  isRequired?: boolean;
  options?: ResponseValue[];
  validations?: Validation[];
}
