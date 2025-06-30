export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export interface FilterButtonsProps {
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
}
