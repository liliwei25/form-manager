import {Conditional} from 'types/conditional';

export const getConditionalsForPage = (
  conditionals: Conditional[],
  pageId: string,
): Conditional[] => {
  return conditionals.filter(
    conditional => conditional.targetPageId === pageId,
  );
};
