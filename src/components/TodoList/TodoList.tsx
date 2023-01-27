import React from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import { TempTodo, Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  filterStatus: FilterStatus;
  tempTodo:TempTodo | null
};

export const TodoList:React.FC<Props> = ({
  todos,
  filterStatus,
  tempTodo,
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
        />
      ))}
      {tempTodo && (
        <TodoInfo
          key={tempTodo.id}
          todo={tempTodo}
        />
      )}
    </section>
  );
};
