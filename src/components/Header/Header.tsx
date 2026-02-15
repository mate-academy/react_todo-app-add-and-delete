import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
type Props = {
  todos: Todo[];
  newTitle: string;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (e: React.FormEvent) => void;
  onTitleChange: (value: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  newTitle,
  isAdding,
  inputRef,
  onSubmit,
  onTitleChange,
}) => {
  return (
    <>
      <header className="todoapp__header">
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.length > 0 && todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
        />

        <form onSubmit={onSubmit}>
          <input
            ref={inputRef}
            disabled={isAdding}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTitle}
            onChange={e => {
              onTitleChange(e.target.value);
            }}
          />
        </form>
      </header>
    </>
  );
};
