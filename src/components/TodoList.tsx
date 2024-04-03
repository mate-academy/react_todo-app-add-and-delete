import React from 'react';
import { useTodos } from '../utils/TodoContext';
import { TodoItem } from './TodoItem';
import { getVisibleTodos } from '../utils/getVisibleTodos';

export const TodoList: React.FC = () => {
  const { todos, status } = useTodos();
  const visibleTodos = getVisibleTodos(todos, status);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </section>
  );
};
