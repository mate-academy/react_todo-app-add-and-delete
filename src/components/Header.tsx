/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
import React from 'react';
import classNames from 'classnames';
import { SubmitForm } from './SubmitForm';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  onInputChange: (newTitle: string) => void,
  inputValue: string,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  isInputFieldDisabled: boolean,
};

export const Header: React.FC<Props> = ({
  todos,
  onInputChange,
  inputValue,
  setInputValue,
  isInputFieldDisabled,
}) => {
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

      <SubmitForm
        todos={todos}
        onInputChange={onInputChange}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isInputFieldDisabled={isInputFieldDisabled}
      />
    </header>
  );
};
