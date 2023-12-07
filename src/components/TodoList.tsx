import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  isLoading: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  isLoading,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isLoading={isLoading.includes(todo.id)}
          deleteId={deleteTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteId={deleteTodo}
          isLoading
        />
      )}
    </section>
  );
};
