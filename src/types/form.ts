import {Page} from './page';

export interface Form {
  id: string;
  title: string;
  description?: string;
  pages: Page[];
}
