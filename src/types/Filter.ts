export enum FilterTitles {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export type Filter = {
  title: FilterTitles;
  link: string;
  dataCy: string;
};
