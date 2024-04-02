import React from 'react';
import { TodoItem } from './TodoItem';
import { useTodos } from '../utils/TodoContext';
import { filterTodos } from '../utils/filterTodos';

export const TodoList: React.FC = () => {
  const { todos, filter, tempTodo } = useTodos();

  const visibleTodos = filterTodos(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} key={tempTodo.id} />}
    </section>
  );
};
