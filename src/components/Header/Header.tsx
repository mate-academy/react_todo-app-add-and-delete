import React, { useEffect, useRef, useState } from 'react';
import './Header.scss';

type Props = {
  inputValue: string;
  onChangeInputValue: (inputValue: string) => void;
  setErrorMessage: (message: string) => void;
  onAddTodo: (title: string) => Promise<void>;
  onRef?: (ref: React.RefObject<HTMLInputElement>) => void;
};

export const Header: React.FC<Props> = ({
  inputValue,
  onChangeInputValue = () => {},
  setErrorMessage,
  onAddTodo,
  onRef,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (onRef) {
      onRef(inputRef);
    }
  }, [onRef]);

  const handleChangeInputValue = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onChangeInputValue(event.target.value);
  };

  const handleDisabledInput = isLoading;

  const handleSubmitInputForm = (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      setErrorMessage('Title should not be empty');
      return;
    }

    setIsLoading(true);

    onAddTodo(inputValue)
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsLoading(false);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmitInputForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleChangeInputValue}
          ref={inputRef}
          disabled={handleDisabledInput}
        />
      </form>
    </header>
  );
};
