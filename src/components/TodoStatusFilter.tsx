export enum TodoStatusFilter {
  All = 'all',
  COMPLETED = 'completed',
  ACTIVE = 'active',
}

type TodoStatusFilterOptions = {
  href: string;
  testId: string;
  text: string;
};

export const TODO_STATUS_FILTER_OPTIONS: /* eslint-disable @typescript-eslint/indent */
Record<
  TodoStatusFilter,
  TodoStatusFilterOptions
  /* eslint-enable @typescript-eslint/indent */
> = {
  [TodoStatusFilter.All]: {
    href: '#/',
    testId: 'FilterLinkAll',
    text: 'All',
  },

  [TodoStatusFilter.COMPLETED]: {
    href: '#/completed',
    testId: 'FilterLinkCompleted',
    text: 'Completed',
  },

  [TodoStatusFilter.ACTIVE]: {
    href: '#/active',
    testId: 'FilterLinkActive',
    text: 'Active',
  },
};
