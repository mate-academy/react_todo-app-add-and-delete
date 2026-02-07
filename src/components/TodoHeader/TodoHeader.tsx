import './TodoHeader.scss';

import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  activeTodos: number;
  todosLength: number;
  tempTodo: Todo | null;
  title: string;
  setTitle: (newtitle: string) => void;
  onToggleAll: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const TodoHeader: React.FC<Props> = ({
  activeTodos,
  todosLength,
  tempTodo,
  title,
  setTitle,
  onToggleAll,
  onSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo, todosLength]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        data-cy="ToggleAllButton"
        className={classNames('todoapp__toggle-all', {
          active: activeTodos === 0 && todosLength > 0,
        })}
        onClick={onToggleAll}
      />

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={!!tempTodo}
          autoFocus
        />
      </form>
    </header>
  );
};
