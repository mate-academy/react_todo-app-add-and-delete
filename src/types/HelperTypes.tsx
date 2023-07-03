export enum FilterType {
  COMPLETED = 'COMPLETED',
  ACTIVE = 'ACTIVE',
  ALL = 'ALL',
}

export enum ErrorType {
  DATALOADING = 'DATALOADING',
  EMPTY_FIELD = 'EMPTY_FIELD',
  ADD_UNABLE = 'ADD_UNABLE',
  DELETE_UNABLE = ' DELETE_UNABLE',
}

export interface TodosInfo {
  length: number,
  countOfActive: number,
  someCompleted: boolean,
}
