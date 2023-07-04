export enum FilterType {
  COMPLETED = 'COMPLETED',
  ACTIVE = 'ACTIVE',
  ALL = 'ALL',
}

export enum ErrorType {
  DATALOADING = 'Error loading data',
  EMPTY_FIELD = 'Title can\'t be empty',
  ADD_UNABLE = 'Title can\'t be empty',
  DELETE_UNABLE = 'Unable to delete a todo',
}

export interface TodosInfo {
  length: number,
  countOfActive: number,
  hasCompleted: boolean,
}
