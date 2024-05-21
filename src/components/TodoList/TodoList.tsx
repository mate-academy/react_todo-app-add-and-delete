import React, { useContext } from 'react';

import { StateContex } from '../../Store';
import { TodoItem } from '../TodoItem';
import { Filter } from '../../types/Filter';

export const TodoList: React.FC = () => {
  const { todos, filter, tempTodo } = useContext(StateContex);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.COMPLETED:
        return todo.completed;
      case Filter.ACTIVE:
        return !todo.completed;
      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        return <TodoItem key={todo.id} todo={todo} />;
      })}
      {tempTodo && <TodoItem todo={tempTodo} isPending={true} />}
    </section>
  );
};
