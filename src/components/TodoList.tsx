import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  loadingTodoIds: number[];
  onDelete: (todoId: number[]) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  isLoading,
  loadingTodoIds,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          isLoading={loadingTodoIds.includes(todo.id)}
          onDelete={onDelete}
          key={todo.id}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading={isLoading} />}
    </section>
  );
};
