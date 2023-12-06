import { Status } from './Status';
import { Todo } from './Todo';

export type State = {
  todos: Todo[],
  filtred: Status,
};
