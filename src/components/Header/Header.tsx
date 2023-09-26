import React, { useState } from 'react';
import cn from 'classnames';
import { ERROR_MESSAGES } from '../../utils/constants/ERROR_MESSAGES';

type Props = {
  onTodoAdd: (todoTitle: string) => Promise<void>,
  setErrorMessage: (title: string) => void,
  textInputRef: React.RefObject<HTMLInputElement>,
};

export const Header: React.FC<Props> = ({
  onTodoAdd,
  setErrorMessage,
  textInputRef,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTodoTitle = todoTitle.trim();

    if (!trimmedTodoTitle) {
      setErrorMessage(ERROR_MESSAGES.titleShouldNotBeEmpty);

      return;
    }

    const currentTextInputRef = textInputRef.current;

    if (currentTextInputRef) {
      currentTextInputRef.disabled = true;
    }

    onTodoAdd(todoTitle)
      .then(() => {
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(ERROR_MESSAGES.unableToAddTodo);
      })
      .finally(() => {
        if (currentTextInputRef) {
          currentTextInputRef.disabled = true;
          textInputRef.current.focus();
        }
      });
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn('todoapp__toggle-all')}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={onFormSubmit}
      >
        <input
          disabled
          ref={textInputRef}
          value={todoTitle}
          onChange={onTitleChange}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
