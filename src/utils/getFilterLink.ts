import { FilterOption } from '../types';

export const getFilterLink = (filterOption: FilterOption) => {
  return `#/${filterOption === FilterOption.all ? '' : filterOption.toLowerCase()}`;
};
