export const getFilteredBy = <T> (
  items: T[],
  ...filterCallbacks: ((item: T) => boolean)[]
) => {
  return items
    .filter(item => filterCallbacks
      .every(callback => callback(item)));
};
