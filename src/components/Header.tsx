import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  areCompleted: boolean;
  isInputDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  query: string;
  onChangeQuery: (query: string) => void;
  onAddTodo: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  areCompleted,
  isInputDisabled,
  inputRef,
  query,
  onChangeQuery,
  onAddTodo,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddTodo();
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    return onChangeQuery(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          disabled={isInputDisabled}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleChangeTitle}
        />
      </form>
    </header>
  );
};
