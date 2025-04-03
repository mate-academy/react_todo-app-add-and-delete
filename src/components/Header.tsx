import classNames from 'classnames';
import React from 'react';

type Props = {
  areAllCompleted: boolean;
  addPost: (title: string) => void;
  isLoading: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
};

export const Header: React.FC<Props> = ({
  areAllCompleted,
  addPost,
  isLoading,
  inputValue,
  setInputValue,
  inputRef,
}) => {
  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    addPost(inputValue);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: areAllCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          disabled={isLoading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
        />
      </form>
    </header>
  );
};
