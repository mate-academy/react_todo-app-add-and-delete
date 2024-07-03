/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useMemo } from 'react';
import { Todo } from '../types/Todo';
import { getFilteredTodos } from '../services/getFilteredTodos';
import { TodoItem } from './TodoItem';
import { useTodosContext } from './useTodosContext';

export const TodoList: React.FC = () => {
  const { todos, tempTodo, query } = useTodosContext();

  const todosToGo = useMemo(() => {
    return getFilteredTodos(todos, query);
  }, [todos, query]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToGo.map((todo: Todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
