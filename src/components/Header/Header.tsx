import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';

type Props = {
  handleSubmit: (e: React.FormEvent) => void,
  handleTitleChange: (value: string) => void,
  handleToggleAll: () => void,
  todoTitle: string,
  isAdding: boolean,
  toggleAll: boolean,
};

export const Header: React.FC<Props> = React.memo(
  ({
    handleSubmit,
    handleTitleChange,
    handleToggleAll,
    todoTitle,
    isAdding,
    toggleAll,
  }) => {
    const newTodoField = useRef<HTMLInputElement>(null);

    useEffect(() => {
      // focus the element with `ref={newTodoField}`
      if (newTodoField.current) {
        newTodoField.current.focus();
      }
    }, [isAdding]);

    return (
      <header className="todoapp__header">
        <button
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: toggleAll },
          )}
          onClick={() => handleToggleAll()}
        />

        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={(e) => handleTitleChange(e.target.value.trimStart())}
            disabled={isAdding}
          />
        </form>
      </header>
    );
  },
);
