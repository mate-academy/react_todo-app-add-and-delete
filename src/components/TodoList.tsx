import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  onDelete: (todoId: number) => void;
  tempTodo: Todo | null;
  loadingTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  onDelete,
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
          loadingTodoId={loadingTodoId}
        />
      ))}

      {tempTodo !== null && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
          loadingTodoId={tempTodo.id}
        />
      )}
    </section>
  );
};
