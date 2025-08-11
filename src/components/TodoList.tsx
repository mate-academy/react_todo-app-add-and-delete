/* eslint-disable prettier/prettier */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  updateTodo: (value: Todo) => Promise<void>;
  deleteTodo: (value: number) => Promise<void>;
  updatingTodoIds: number[];
}

/* eslint-disable prettier/prettier */
export const TodoList: React.FC<Props> = ({
  todos,
  updateTodo,
  deleteTodo,
  updatingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          updatingTodoIds={updatingTodoIds}
        />
      ))}
    </section>
  );
};
