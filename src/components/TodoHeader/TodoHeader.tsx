import React from 'react';
import classNames from 'classnames';

import { UseTodosContext } from '../../utils/TodosContext';

import { TodoForm } from '../TodoForm';

type Props = {};

export const TodoHeader: React.FC<Props> = () => {
  const context = UseTodosContext();
  const {
    todos,
    isAllCompleted,
    setIsAllCompleted,
  } = context;

  const currentCompletionStatus = todos.every(({ completed }) => completed);

  const changeAllTodosStatus = () => {
    if (isAllCompleted || currentCompletionStatus) {
      setIsAllCompleted(false);

      return;
    }

    setIsAllCompleted(true);
  };

  return (
    <header className="todoapp__header">
      {Boolean(todos.length) && (
        // eslint-disable-next-line
        <button
          data-cy="ToggleAllButton"
          onClick={changeAllTodosStatus}
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: currentCompletionStatus,
          })}
        />
      )}

      <TodoForm />
    </header>
  );
};
