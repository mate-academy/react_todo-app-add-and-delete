import { memo } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodos: (id: number) => void,
  deleteTodosId: number | null,
}

export const TodoList: React.FC<Props> = memo(({
  todos, tempTodo, deleteTodos, deleteTodosId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({ title, completed, id }) => (
        <TodoItem
          title={title}
          completed={completed}
          id={id}
          key={id}
          deleteTodos={deleteTodos}
          isLoading={deleteTodosId === id}
        />
      ))}
      {tempTodo && (
        <TodoItem
          title={tempTodo.title}
          completed={false}
          id={tempTodo.id}
          deleteTodos={deleteTodos}
          isLoading
        />
      )}
    </section>
  );
});
