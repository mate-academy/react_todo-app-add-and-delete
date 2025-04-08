import React from 'react';
import cn from 'classnames';

interface Props {
  allTodos: React.MutableRefObject<number>;
  inputRef: React.RefObject<HTMLInputElement>;
  isSubmiting: boolean;
  newTodoTitle: string;
  handleSubmit: (e: React.FormEvent) => void;
  setNewTodoTitle: (value: React.SetStateAction<string>) => void;
  checkTodoCompleted: () => number;
  handleToggleActivate: () => void;
}

export const Header: React.FC<Props> = React.memo(
  ({
    allTodos,
    inputRef,
    isSubmiting,
    newTodoTitle,
    handleSubmit,
    setNewTodoTitle,
    checkTodoCompleted,
    handleToggleActivate,
  }) => {
    return (
      <header className="todoapp__header">
        {Boolean(allTodos.current) && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: checkTodoCompleted(),
            })}
            data-cy="ToggleAllButton"
            onClick={handleToggleActivate}
          />
        )}

        <form onSubmit={e => handleSubmit(e)}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTodoTitle}
            onChange={e => setNewTodoTitle(e.target.value)}
            ref={inputRef}
            disabled={isSubmiting}
          />
        </form>
      </header>
    );
  },
);

Header.displayName = 'Header';
