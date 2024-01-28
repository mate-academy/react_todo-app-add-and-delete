import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  onDelete: (id: number) => void,
  tempTodo: Todo | null,
  selectedId: number,
  loadClear: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  selectedId,
  loadClear,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          selectedId={selectedId}
          onDelete={onDelete}
          loadingClear={loadClear}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          selectedId={selectedId}
          loadingClear={loadClear}
        />
      )}
    </section>
  );
};
