import React from 'react';
import { TodoItem } from './TodoItem';
import { useTodos } from '../utils/TodoContext';
import { getVisibleTodos } from '../utils/getVisibleTodos';

export const TodoList: React.FC = () => {
  const { todos, status, draftTodo } = useTodos();
  const visibleTodos = getVisibleTodos(todos, status);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {draftTodo && <TodoItem todo={draftTodo} />}
    </section>
  );
};
