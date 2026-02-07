import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  title: string;
  setTitle: (value: string) => void;
  loading: boolean;
  onAdd: (event: React.FormEvent) => void;
  onToggleAll: () => void;
  inputRef?: React.RefObject<HTMLInputElement>; // 👈 Додали
}

export const Header: React.FC<Props> = ({
  todos,
  title,
  setTitle,
  loading,
  onAdd,
  onToggleAll,
  inputRef,
}) => {
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onAdd}>
        <input
          ref={inputRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={loading}
          autoFocus
        />
      </form>
    </header>
  );
};
