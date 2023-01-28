import React from 'react';
import { Todo } from '../types';
import { TodoItem } from './TodoItem';

export type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
        />
      ))}
    </section>
  );
};
