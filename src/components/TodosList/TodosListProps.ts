import { CommonTodosProps, Todo } from '../../types/Todo';

export interface TodosListProps extends CommonTodosProps {
  todos: Todo[];
  tempTodo: Todo | null;
}
