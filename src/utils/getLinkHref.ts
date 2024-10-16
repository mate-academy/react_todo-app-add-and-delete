import { Filter } from '../types/FilterEnum';

export const getLinkHref = (linkValue: Filter) => {
  switch (linkValue) {
    case Filter.ACTIVE:
      return '#/active';

    case Filter.ALL:
      return '#/completed';

    default:
      return '#/';
  }
};
