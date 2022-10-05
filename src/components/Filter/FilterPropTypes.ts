export type Props = {
  setFilterType: (type :FilterType) => void;
  filterType: FilterType;
};

export enum FilterType {
  All,
  Active,
  Completed,
}
