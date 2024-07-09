import { FormEvent, useEffect, useRef } from 'react';

type Props = {
  newTodoTitle: string;
  setNewTodo: (value: string) => void;
  addTodo: () => void;
  onError: (error: string) => void;
  onDisabled: boolean;
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodo,
  addTodo,
  onDisabled,
  onError,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleAddTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      onError('Title should not be empty');
      setTimeout(() => onError(''), 3000);

      return;
    }

    addTodo();
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          disabled={onDisabled}
          onChange={e => setNewTodo(e.target.value)}
        />
      </form>
    </header>
  );
};
