import { Data, FilterBy } from '../types/types';

export const filteredData = <T>(
  data: Array<T & Data>,
  filter: FilterBy,
): T[] => {
  switch (filter) {
    case (FilterBy.Active):
      return data.filter(({ completed }) => !completed);

    case (FilterBy.Completed):
      return data.filter(({ completed }) => completed);

    case (FilterBy.All):
    default:
      return data;
  }
};
