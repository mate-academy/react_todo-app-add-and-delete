import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number[]) => void;
  isLoading: boolean;
  loadingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  tempTodo,
  filteredTodos,
  onDelete,
  isLoading,
  loadingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={loadingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading={isLoading} />}
    </section>
  );
};
