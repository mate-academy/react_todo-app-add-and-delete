import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, updated: Partial<Todo>) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  onDelete,
  onUpdate,
  tempTodo,
}) => {
  const renderTodos = useMemo(
    () => (tempTodo ? [...visibleTodos, tempTodo] : visibleTodos),
    [visibleTodos, tempTodo],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {renderTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isTempTodo={todo.id === 0}
        />
      ))}
    </section>
  );
};
