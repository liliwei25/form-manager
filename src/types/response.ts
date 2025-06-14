import { Question } from './question';
import { ResponseValue } from './response-value';

export type Response = Record<Question['id'], ResponseValue>;
