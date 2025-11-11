export enum Status {
  ALL = 'all',
  COMPLETED = 'completed',
  ACTIVE = 'active',
}

type FilterOption = {
  href: string;
  testId: string;
  text: string;
};

export const TODO_STATUS_FILTER_OPTIONS: Record<Status, FilterOption> = {
  [Status.ALL]: {
    href: '/',
    testId: 'FilterLinkAll',
    text: 'All',
  },
  [Status.COMPLETED]: {
    href: '/completed',
    testId: 'FilterLinkCompleted',
    text: 'Completed',
  },
  [Status.ACTIVE]: {
    href: '/active',
    testId: 'FilterLinkActive',
    text: 'Active',
  },
};
