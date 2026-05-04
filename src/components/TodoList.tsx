import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  onDelete: (todoId: number) => void;
  onToggleStatus: (id: number) => void;
  tempTodo: Todo | null;
  loadingTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  onDelete,
  onToggleStatus,
  tempTodo,
  loadingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          loadingTodoId={loadingTodoId}
        />
      ))}

      {tempTodo !== null && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          loadingTodoId={tempTodo.id}
        />
      )}
    </section>
  );
};
