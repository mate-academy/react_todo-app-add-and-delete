import { Statuses } from '../types/Statuses';

export const filterOptions = [
  { label: 'All', status: Statuses.All },
  { label: 'Active', status: Statuses.Active },
  { label: 'Completed', status: Statuses.Completed },
] as const;
