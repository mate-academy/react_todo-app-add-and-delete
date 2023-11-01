/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useContext } from 'react';
import cn from 'classnames';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodosFilter';
import { Header } from './components/Header';
import { Status } from './types/enums/Status';
import { TodosContext } from './store/store';

import { UserWarning } from './UserWarning';
import { Errors } from './types/enums/Errors';

const USER_ID = 11806;

export const App: React.FC = () => {
  const [filterParam, setFilterParam] = useState<Status>(Status.All);
  const { todos, errorType, clearErrorMessage } = useContext(TodosContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSetFilterParam = (param: Status) => {
    setFilterParam(param);
  };

  const souldRenderList = Boolean(todos.length);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header />

        {souldRenderList
          && (
            <>
              <section className="todoapp__main" data-cy="TodoList">
                <TodoList filterParam={filterParam} />
              </section>

              {/* Hide the footer if there are no todos */}
              <TodoFilter
                handleSetFilterParam={handleSetFilterParam}
                filterParam={filterParam}
              />
            </>
          )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorType },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={clearErrorMessage}
        />
        {/* show only one message at a time */}
        {errorType === Errors.GET
          && 'Unable to load todos'}
        {errorType === Errors.POST
          && 'Unable to add a todo'}
        {errorType === Errors.EMPTY
          && 'Title should not be empty'}
        {errorType === Errors.DELETE
          && 'Unable to delete a todo'}
        {/* <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
