import { Todo } from '../types/Todo';
import { TodoItem } from '../components';

interface Props {
  visibleTodos: Todo[];
  handleDeleteTodo: (todoId: number) => void;
  todosBeingDeleted: number[];
}

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  handleDeleteTodo,
  todosBeingDeleted,
}: Props) =>
  visibleTodos.map(todo => (
    <TodoItem
      todo={todo}
      key={todo.id}
      handleDeleteTodo={handleDeleteTodo}
      todosBeingDeleted={todosBeingDeleted}
    />
  ));
