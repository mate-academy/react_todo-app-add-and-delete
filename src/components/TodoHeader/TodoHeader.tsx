import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  countOfTodos: number;
  countOfCompletedTodos: number;
  handleAddTodo: (title: string) => Promise<void>;
  setErrorMessage: (error: string) => void;
  isInputDisabled: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  countOfTodos,
  countOfCompletedTodos,
  handleAddTodo,
  setErrorMessage,
  isInputDisabled,
}) => {
  const [inputText, setInputText] = useState('');
  const isAllTodosCompleted = countOfCompletedTodos === countOfTodos;
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await handleAddTodo(inputText);
      setInputText('');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(String(error));
      }
    }
  }

  useEffect(() => {
    if (inputRef.current && !isInputDisabled) {
      inputRef.current.focus();
    }
  }, [countOfTodos, isInputDisabled]);

  return (
    <header className="todoapp__header">
      {countOfTodos !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputText}
          onChange={event => setInputText(event.target.value)}
          disabled={isInputDisabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
