/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo } from '../../types/Todo';

import { TodoItem } from './TodoItem';

type Props = {
  onRemoveTodo: (todoId: number) => void;
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
};

export const TodoList = ({
  onRemoveTodo,
  visibleTodos,
  tempTodo,
  loadingTodoIds: loadingTodosIds,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onRemove={onRemoveTodo}
          isLoading={loadingTodosIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem todo={tempTodo} isLoading={true} onRemove={onRemoveTodo} />
      )}
    </section>
  );
};
