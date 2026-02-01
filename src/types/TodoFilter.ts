export enum FilterStatus {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

type TodoFilterNavItem = {
  label: string;
  value: FilterStatus;
  href: string;
  dataCy: string;
};

export const TODO_FILTER_NAV_CONFIG: TodoFilterNavItem[] = [
  {
    label: 'All',
    value: FilterStatus.All,
    href: '#/',
    dataCy: 'FilterLinkAll',
  },
  {
    label: 'Active',
    value: FilterStatus.Active,
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    label: 'Completed',
    value: FilterStatus.Completed,
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];
