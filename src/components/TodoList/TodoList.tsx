import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processingIds,
  onDelete,
  onToggle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessing={processingIds.includes(todo.id)}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isProcessing={true}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      )}
    </section>
  );
};
