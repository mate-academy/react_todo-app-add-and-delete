import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  handleDelete: (id: number) => Promise<unknown>;
  handleComplete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleComplete,
  handleDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleComplete={handleComplete}
          handleDelete={handleDelete}
        />
      ))}
    </section>
  );
};
