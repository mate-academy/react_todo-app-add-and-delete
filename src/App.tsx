/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoError } from './components/TodoError/TodoError';

import { StateContext } from './Context/Store';

const preparedTodos = (items: Todo[], filter: Filter): Todo[] => {
  let copy = [...items];

  copy = copy.filter(item => {
    switch (filter) {
      case Filter.All:
        return true;

      case Filter.Active:
        return !item.completed;

      case Filter.Completed:
        return item.completed;

      default:
        return true;
    }
  });

  return copy;
};

export const App: React.FC = () => {
  const state = useContext(StateContext);
  const [filter, setFilter] = useState(Filter.All);

  if (!state.userId) {
    return <UserWarning />;
  }

  const countLeft = state.todos.filter(todo => !todo.completed).length;
  const haveCompleted = state.todos.filter(todo => todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />
        {state.todos.length !== 0 && (
          <>
            <TodoList todos={preparedTodos(state.todos, filter)} />

            <TodoFooter
              setFilter={setFilter}
              filter={filter}
              countLeft={countLeft}
              haveCompleted={haveCompleted}
            />
          </>

        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <TodoError />
    </div>
  );
};
