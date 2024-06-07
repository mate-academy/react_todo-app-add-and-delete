import { Todo } from '../../types/Todo';

export enum ActionType {
  GET = 'GET',
  ADD = 'ADD',
  DELETE = 'DELETE',
  SET = 'SET',
}

export type GetAction = {
  type: ActionType.GET;
};

export type SetAction = {
  type: ActionType.SET;
  payload: Todo[];
};

export type AddAction = {
  type: ActionType.ADD;
  payload: Todo;
};

export type DeleteAction = {
  type: ActionType.DELETE;
  payload: number;
};

export type Actions = GetAction | AddAction | DeleteAction | SetAction;
