import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

export type Props = {
  todos: Todo[];
  loading: boolean;
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  loading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {loading ? (
        <div className="loader" data-cy="Loader"></div>
      ) : (
        <>
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              loading={loading}
            />
          ))}
          {tempTodo && (
            <TodoItem
              key={tempTodo.id}
              todo={tempTodo}
              onDelete={onDelete}
              loading={loading}
            />
          )}
        </>
      )}
    </section>
  );
};
