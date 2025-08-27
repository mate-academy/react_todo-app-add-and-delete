import React from 'react';
import classNames from 'classnames';
import { NewTodoForm } from './NewTodoForm';
import { Result } from '../types/Results';

type Props = {
  isLoading: boolean;
  isTodosListEmpty: boolean;
  isAllTodosCompleted: boolean;
  lastAction: number;
  onNewTodoFormSubmit: (result: Result) => Promise<boolean>;
};

export const TodoHeader: React.FC<Props> = ({
  isLoading,
  isTodosListEmpty,
  isAllTodosCompleted,
  lastAction,
  onNewTodoFormSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {!isTodosListEmpty && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <NewTodoForm
        isLoading={isLoading}
        onFormSubmit={onNewTodoFormSubmit}
        lastAction={lastAction}
      />
    </header>
  );
};
