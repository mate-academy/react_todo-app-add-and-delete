import { useState, useEffect } from 'react';
import { FilterType } from '../types/FilterType';

export const useFilter = () => {
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const validFilters = ['all', 'active', 'completed'];

    if (validFilters.includes(hash)) {
      setFilter(hash as FilterType);
    } else {
      setFilter('all');
    }
  }, []);

  return {
    filter,
    setFilter,
  };
};
