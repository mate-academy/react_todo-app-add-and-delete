import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  selectedId: number;
  onDelete: (id: number) => void;
  loadingClearCompleted: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  selectedId,
  onDelete,
  loadingClearCompleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          selectedId={selectedId}
          onDelete={onDelete}
          loadingClearCompleted={loadingClearCompleted}
        />
      ))}

      {tempTodo && (
        <TodoItem
          onDelete={onDelete}
          todo={tempTodo}
          selectedId={selectedId}
        />
      )}
    </section>
  );
};
