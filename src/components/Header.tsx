import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

interface Props {
  hasTodos: boolean;
  isAllCompleted: boolean;
  isAdding: boolean;
  onAddTodo: (title: string, onSuccess: () => void) => void;
  onToggleAll?: () => void;
  focusTrigger: number;
}

export const Header: React.FC<Props> = ({
  hasTodos,
  isAllCompleted,
  isAdding,
  onAddTodo,
  onToggleAll,
  focusTrigger,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [focusTrigger, isAdding]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAddTodo(title, () => setTitle(''));
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isAdding}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
