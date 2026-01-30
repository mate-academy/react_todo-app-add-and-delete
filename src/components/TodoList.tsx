import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => Promise<void>;
  loadingIds: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  loadingIds,
}) => {
  const shouldShowTemp =
    tempTodo && !todos.some(todo => todo.title === tempTodo.title);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoaderActive={loadingIds.includes(todo.id) || todo.id === 0}
        />
      ))}

      {shouldShowTemp && <TodoItem todo={tempTodo} isLoaderActive={true} />}
    </section>
  );
};
