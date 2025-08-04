import React from 'react';
import { Todo } from './types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  filteredTodos: Todo[];
  setError: (error: string | null) => void;
  tempTodo?: Todo | null;
  loadingTodo: number | null;
  onDelete: (id: number) => void;
}

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  setError,
  tempTodo,
  loadingTodo,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          setError={setError}
          loadingTodo={loadingTodo}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading
          setError={setError}
          loadingTodo={loadingTodo}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};
