/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { SubmitForm } from './SubmitForm';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
};

export const Header: React.FC<Props> = ({ todos }) => {
  const noCompletedTodos = todos?.length
    ? todos.every((todo) => todo.completed)
    : false;

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: noCompletedTodos },
          )}
          data-cy="ToggleAllButton"
        />
      )}
      {/* Add a todo on form submit */}
      <SubmitForm />
    </header>
  );
};
