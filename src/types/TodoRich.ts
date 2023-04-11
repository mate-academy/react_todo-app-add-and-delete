import { Todo } from './Todo';

export interface TodoRich extends Todo {
  isLoading: boolean;
}
