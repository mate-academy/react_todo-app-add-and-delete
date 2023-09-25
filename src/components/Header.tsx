/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  onInputChange: (newTitle: string) => void,
  inputValue: string,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  isInputFieldDisabled: boolean,
  onHandleChangellCompleted: () => void,
};

export const Header: React.FC<Props> = ({
  todos,
  onInputChange,
  inputValue,
  setInputValue,
  isInputFieldDisabled,
  onHandleChangellCompleted,
}) => {
  const noCompletedTodos = todos?.length
    ? todos.every((todo) => todo.completed)
    : false;

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const inputReference = useRef(null);

  const setInputFocus = () => {
    if (!isInputFieldDisabled && inputReference?.current) {
      const input: HTMLInputElement = inputReference.current;

      input.focus();
    }
  };

  useEffect(() => {
    setInputFocus();
  }, [inputValue, isInputFieldDisabled, todos]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onInputChange(inputValue);
  };

  const handleChangeAllCompleted = () => {
    onHandleChangellCompleted();
  };

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
          onClick={handleChangeAllCompleted}
        />
      )}

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          ref={inputReference}
          disabled={isInputFieldDisabled}
          value={inputValue}
          onChange={handleTitleChange}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
