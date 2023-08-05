import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  filteredTodos: Todo[],
  onDelete: (todoId: number) => void,
  isLoading: boolean,
  isActiveIds: number[],
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  onDelete,
  isLoading,
  isActiveIds,
  tempTodo,
}) => {
  const visibleTodos = tempTodo !== null
    ? [...filteredTodos, tempTodo]
    : filteredTodos;

  return (
    <>
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={isLoading}
          isActiveIds={isActiveIds}
        />
      ))}
    </>
  );
};
