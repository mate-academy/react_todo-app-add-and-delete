import React, { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { FilterStatus } from '../../types/FilterStatus';
import { TodoInfo } from '../TodoInfo';

export const TodoList:React.FC = () => {
  const {
    filterStatus,
    todos,
    tempTodo,
  } = useContext(AppContext);

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
