import { FilterTypes } from '../types/FilterTypes';
import { FILTERS } from './constants';

export const findFilterByType = (filterType: FilterTypes) =>
  FILTERS.find(({ type }) => type === filterType) || FILTERS[0];

export const findFilterByHash = (hash: string) =>
  FILTERS.find(filter => filter.hash === hash) || FILTERS[0];
