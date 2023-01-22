/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from 'react';

type Props = {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  setIsHidden: Dispatch<SetStateAction<boolean>>;
  handleAdd: () => void;
  completeAll: () => void;
  isAdding: boolean;
  completedTodosCount: number,
  todosCount: number,
};

export const Header: React.FC<Props> = (
  {
    title,
    setTitle,
    setIsHidden,
    handleAdd,
    completeAll,
    isAdding,
    completedTodosCount,
    todosCount,
  },
) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {todosCount !== 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            {
              active: completedTodosCount > 0,
            },
          )}
          onClick={completeAll}
        />
      )}

      <form onSubmit={e => e.preventDefault()}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isAdding === true}
          onChange={e => {
            setTitle(e.target.value);
            setIsHidden(true);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleAdd();
            }
          }}
        />
      </form>
    </header>
  );
};
