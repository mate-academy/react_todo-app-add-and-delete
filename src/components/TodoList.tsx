import React from 'react';
import { TodoItems } from './TodoItems';
import { useTodos } from './TodoContext';
import { getVisibleTodos } from '../api/todos';

export const TodoList: React.FC = () => {
  const { todos, status } = useTodos();
  const visibleTodos = getVisibleTodos(todos, status);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItems key={todo.id} todo={todo} />
      ))}
    </section>
  );
};
