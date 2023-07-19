export enum LogingSteps {
  EMAIL,
  NAME,
  COMPLETE,
}

export enum ResponseError {
  NOT = '0',
  ADD = 'Unable to add a todo',
  DELETE = 'Unable to delete a todo',
  UPDATE = 'Unable to update a todo',
  EMPTY = "Title can't be empty",
}

export enum Etodos {
  ALL,
  ACTIVE,
  COMPLETED,
}
