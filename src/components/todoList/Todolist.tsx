import React from 'react';
import { Todo as OneTodo } from '../todo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  loading: number[];
  tempTodo: Todo | null;
  handleDelete: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loading,
  tempTodo,
  handleDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <OneTodo
          todo={todo}
          key={todo.id}
          handleDelete={handleDelete}
          loading={loading}
        />
      ))}
      {tempTodo && (
        <OneTodo
          todo={tempTodo}
          loading={loading}
          handleDelete={handleDelete}
        />
      )}
    </section>
  );
};
