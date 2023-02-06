import React from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  filterStatus: FilterStatus;
  onSetTodos: (todos: Todo[]) => void,
  onSetError: (message: string) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  filterStatus,
  onSetTodos,
  onSetError,

}) => {
  const visibleTodos = todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          todos={todos}
          onSetTodos={onSetTodos}
          onSetError={onSetError}
        />
      ))}
    </section>
  );
};
