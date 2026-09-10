import { Status } from '../types/Status';

type FilterOption = {
  status: Status;
  label: string;
  dataCy: string;
};

export const FILTERS: FilterOption[] = [
  { status: Status.All, label: 'All', dataCy: 'FilterLinkAll' },
  { status: Status.Active, label: 'Active', dataCy: 'FilterLinkActive' },
  {
    status: Status.Completed,
    label: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
];
