import {QuestionType} from '@/types/question-type';
import {ResponseValue} from '@/types/response-value';
import {Validation} from '@/types/validation';

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  isRequired?: boolean;
  options?: ResponseValue[];
  validations?: Validation[];
}
