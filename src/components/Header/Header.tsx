import classNames from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  areAllTodosCompleted: boolean;
  onAdd: (title: string) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement>;
  hasTodos: boolean;
};

export const Header: React.FC<Props> = ({
  areAllTodosCompleted,
  onAdd,
  inputRef,
  hasTodos,
}) => {
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.disabled = true;

      onAdd(inputElement.value)
        .then(() => {
          if (inputElement) {
            inputElement.value = '';
          }
        })
        .catch(() => {})
        .finally(() => {
          if (inputElement) {
            inputElement.disabled = false;
            inputElement.focus();
          }
        });
    }
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllTodosCompleted,
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
          ref={inputRef}
        />
      </form>
    </header>
  );
};
