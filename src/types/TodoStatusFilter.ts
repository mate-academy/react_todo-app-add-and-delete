export enum TodoStatusFilter {
  ALL = 'all',
  COMPLETED = 'completed',
  ACTIVE = 'active',
}

type TodoStatusFilterOption = {
  href: string;
  testId: string;
  text: string;
};
/* eslint-disable @typescript-eslint/indent */
export const TODO_STATUS_FILTER_OPTIONS: Record<
  TodoStatusFilter,
  TodoStatusFilterOption
> = {
  /* eslint-enable @typescript-eslint/indent */
  [TodoStatusFilter.ALL]: {
    href: '#/',
    testId: 'FilterLinkAll',
    text: 'All',
  },
  [TodoStatusFilter.ACTIVE]: {
    href: '#/active',
    testId: 'FilterLinkActive',
    text: 'Active',
  },
  [TodoStatusFilter.COMPLETED]: {
    href: '#/completed',
    testId: 'FilterLinkCompleted',
    text: 'Completed',
  },
};
