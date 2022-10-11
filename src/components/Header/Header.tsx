import React, { useRef, useEffect } from 'react';

type Props = {
  todoTitle: string,
  isAdding: boolean,
  setTodoTitle: (value: string) => void,
  handleLoadTodoOnServer: (value: React.FormEvent) => void,
};

export const Header: React.FC<Props> = React.memo(
  ({
    todoTitle,
    isAdding,
    setTodoTitle,
    handleLoadTodoOnServer,
  }) => {
    const newTodoField = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (newTodoField.current) {
        newTodoField.current.focus();
      }
    }, [isAdding]);

    return (
      <header className="todoapp__header">
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
        >
          <></>
        </button>

        <form onSubmit={(event) => handleLoadTodoOnServer(event)}>
          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={(event) => setTodoTitle(event.target.value.trim())}
            disabled={isAdding}
          />
        </form>
      </header>
    );
  },
);
