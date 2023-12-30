/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { todos } from './signals';
import { Error } from './components/Error/Error';

const USER_ID = 12122;

export const App: React.FC = () => {
  useSignals();
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>
        {!!todos.value.length && (
          <TodoList />
        )}
      </div>
      <Error />

    </div>
  );
};
