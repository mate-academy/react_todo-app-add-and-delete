import { Todo } from './Todo';

export interface TodoWithLoader extends Todo {
  loading: boolean;
}
