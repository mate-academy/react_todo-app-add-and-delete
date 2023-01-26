import React, { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { FilterStatus } from '../../types/FilterStatus';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
};

export const TodoList:React.FC<Props> = ({ todos }) => {
  const { filterStatus } = useContext(AppContext);
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
    </section>
  );
};
