import {ValidationType} from './validation-type';

export interface Validation {
  type: ValidationType;
  value?: string | number | boolean;
  message?: string;
}
