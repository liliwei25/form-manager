import {Question} from '@/types/question';
import {ResponseValue} from '@/types/response-value';

export type Response = Record<Question['id'], ResponseValue>;
