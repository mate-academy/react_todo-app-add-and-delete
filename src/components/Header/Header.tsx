import classNames from 'classnames';
import React from 'react';

type Props = {
  isButtonActive?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  title: string;
  isInputDisabled: boolean;
  isButtonExists: boolean;
  onTitleChange: (title: string) => void;
  onAddTodo: () => Promise<void>;
  reset: () => void;
};

export const Header: React.FC<Props> = ({
  isButtonActive = false,
  inputRef,
  title,
  isInputDisabled,
  isButtonExists,
  onTitleChange,
  onAddTodo,
  reset,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddTodo().then(reset);
  };

  return (
    <header className="todoapp__header">
      {isButtonExists && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isButtonActive,
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
          disabled={isInputDisabled}
          ref={inputRef}
          value={title}
          onChange={event => onTitleChange(event.target.value)}
        />
      </form>
    </header>
  );
};
