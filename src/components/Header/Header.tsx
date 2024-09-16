import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

type Props = {
  areAllTodosCompleted: boolean;
  addTodo: (title: string) => Promise<void>;
};

export const Header: React.FC<Props> = ({
  areAllTodosCompleted = false,
  addTodo = () => Promise.resolve(),
}) => {
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !loading) {
      inputRef.current.focus();
    }
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    addTodo(newTodo)
      .then(() => setNewTodo(''))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: areAllTodosCompleted })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={newTodo}
          onChange={handleInputChange}
          autoFocus
          disabled={loading}
        />
      </form>
    </header>
  );
};
