import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  selectedId: number;
  onDelete: (id: number) => void;
  loading: boolean;
  loadingClearCompleted: boolean;
  completedTodos: Todo[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  selectedId,
  onDelete,
  loading,
  completedTodos,
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
          loading={loading}
          completedTodos={completedTodos}
          loadingClearCompleted={loadingClearCompleted}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          selectedId={selectedId}
          loading={loading}
        />
      )}
    </section>
  );
};
