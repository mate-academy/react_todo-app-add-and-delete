import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (id: number) => void;
  tempTodo?: Todo | null;
  setLoading?: () => void;
  loading: boolean;
  loadingId?: number[];
};

export const Section: React.FC<Props> = ({
  tempTodo,
  todos,
  handleDeleteTodo,
  loading,
  loadingId = [],
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          handleDeleteTodo={handleDeleteTodo}
          todo={todo}
          loading={loadingId.includes(todo.id)}
        />
      ))}
      {tempTodo && loading && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          loading={loading}
        />
      )}
    </section>
  );
};
