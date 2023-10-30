/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';

import { Todo } from './types/Todo';
import { FilterBy } from './types/FilterBy';
import { StateContext } from './states/Global';
import { UserWarning } from './components/UserWarning';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoErrors } from './components/TodoErrors';

const prepareTodos = (todos: Todo[], filterBy: FilterBy): Todo[] => {
  return todos.filter((todo) => {
    switch (filterBy) {
      case FilterBy.Completed:
        return todo.completed;
      case FilterBy.Active:
        return !todo.completed;
      default:
        return true;
    }
  });
};

export const App: React.FC = () => {
  const { userId, todos } = useContext(StateContext);
  const [selectedFilter, setSelectedFilter] = useState(FilterBy.All);
  const preparedTodos = prepareTodos(todos, selectedFilter);

  if (!userId) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        <TodoList todos={preparedTodos} />

        { todos.length !== 0 && (
          <TodoFooter
            selectedFilter={selectedFilter}
            onFilterSelected={setSelectedFilter}
          />
        )}
      </div>

      <TodoErrors />
    </div>
  );
};
