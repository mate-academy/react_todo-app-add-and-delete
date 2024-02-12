import { Filter } from './Filter';
import { Notification } from './Notification';
import { Todo } from './Todo';

export interface State {
  todos: Todo[],
  tempTodo: Todo | null,
  filterType: Filter,
  notification: Notification | null,
  coveredTodoIds: number[],
}
