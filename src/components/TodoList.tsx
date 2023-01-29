import React from 'react';
import { Todo } from '../types';
import { TodoItem } from './TodoItem';

export type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  toggleTodo,
}) => {
  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          toggleTodo={toggleTodo}
        />
      ))}
    </section>
  );
};
