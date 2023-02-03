import React from 'react';
import { Todo } from '../../types/Todo';
import { ToDo } from '../ToDo/ToDo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onRemove: (todoId: number) => void
  deletingToDoId: number[]
};

export const ToDoList: React.FC<Props> = ({
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
        <ToDo
          todo={todo}
          key={todo.id}
          onRemove={onRemove}
          isDeleting={isTodoDeleting(todo.id || 0)}
        />
      ))}

      {tempTodo && (
        <ToDo todo={tempTodo} isTemp />
      )}
    </section>
  );
};
