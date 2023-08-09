import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  loadingTodoIds: number[],
  removeTodo: (id: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  removeTodo,
}) => {
  const isLoading = (todoId: number) => loadingTodoIds.includes(todoId);

  return (
    <ul className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={isLoading(todo.id)}
          removeTodo={removeTodo}
        />
      ))}
    </ul>
  );
};
