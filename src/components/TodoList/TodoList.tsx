import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  filteredTodos: Todo[],
  deleteTodo: (todoId: number) => void,
  isLoading: boolean,
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  deleteTodo,
  isLoading,
}) => {
  return (
    <>
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          isLoading={isLoading}
        />
      ))}
    </>
  );
};
