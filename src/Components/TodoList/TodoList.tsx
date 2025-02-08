import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  isSubmitting: boolean;
  isDeleting?: Todo | undefined;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onToggle,
  tempTodo,
  isSubmitting,
  onDelete,
  isDeleting,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          onToggle={() => {}}
          isSubmitting={isSubmitting}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};
