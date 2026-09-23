import { TodoItem } from '../TodoItem';

import type { TempTodo, Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: TempTodo | null;
  deletingTodoIds: Set<number>;
  onTodoDelete: (todoId: number) => void;
};

export const TodoList = ({
  todos,
  tempTodo,
  deletingTodoIds,
  onTodoDelete,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={deletingTodoIds.has(todo.id)}
          onTodoDelete={onTodoDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem todo={tempTodo} isLoading onTodoDelete={onTodoDelete} />
      )}
    </section>
  );
};
