import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  loadingIds: number[];
  tempTodo: Todo | null;
  handleDeleteTodo: (todoId: number) => void;
};

export const TodoList = ({
  filteredTodos,
  loadingIds,
  tempTodo,
  handleDeleteTodo,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loadingIds={loadingIds}
          handleDeleteTodo={handleDeleteTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          loadingIds={[0]}
          handleDeleteTodo={handleDeleteTodo}
        />
      )}
    </section>
  );
};
