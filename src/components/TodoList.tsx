import React, { useContext, useMemo } from 'react';

import { StateContext } from '../store/TodoContext';
import { TodoItem } from './TodoItem';

import { FilterStatus } from '../types/FilterStatus';

export const TodoList: React.FC = () => {
  const { todos, filterStatus, tempTodo } = useContext(StateContext);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filterStatus === FilterStatus.Active) {
        return todo.completed === false;
      }

      if (filterStatus === FilterStatus.Completed) {
        return todo.completed === true;
      }

      return true;
    });
  }, [todos, filterStatus]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos?.map(todo => <TodoItem key={todo.id} todo={todo} />)}
      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
