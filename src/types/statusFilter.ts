export enum StatusFilter {
  All = '',
  Active = 'active',
  Completed = 'completed',
}

type StatusFilterOptions = {
  href: string;
  testId: string;
  text: string;
};

export const STATUS_FILTER_OPTIONS: Record<StatusFilter, StatusFilterOptions> =
  {
    [StatusFilter.All]: {
      href: `#/${StatusFilter.All}`,
      testId: 'FilterLinkAll',
      text: 'All',
    },
    [StatusFilter.Active]: {
      href: `#/${StatusFilter.Active}`,
      testId: 'FilterLinkActive',
      text: 'Active',
    },
    [StatusFilter.Completed]: {
      href: `#/${StatusFilter.Completed}`,
      testId: 'FilterLinkCompleted',
      text: 'Completed',
    },
  };
