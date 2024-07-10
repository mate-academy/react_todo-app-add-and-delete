import { Filter } from '../types/common';

export const extractFilter = (hash: string) => {
  return (hash.split('#')[1]?.replace('/', '') || null) as Filter | null;
};
