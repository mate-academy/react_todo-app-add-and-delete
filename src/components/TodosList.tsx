import React from 'react';
import { Todo } from '../types/Todo';
import { Todos } from './Todos';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onRemove: (todoId: number) => void
  deletingToDoId: number[]
};

export const TodosList: React.FC<Props> = ({
  todos,
  onRemove,
  tempTodo,
  deletingToDoId,
}) => {
  const isTodoDeleting = (id: number) => {
    return deletingToDoId.includes(id);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todos
          todo={todo}
          key={todo.id}
          onRemove={onRemove}
          isDeleting={isTodoDeleting(todo.id || 0)}
        />
      ))}

      {tempTodo && (
        <Todos todo={tempTodo} isTemp />
      )}
    </section>
  );
};
