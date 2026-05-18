import { useState, useRef, useEffect } from 'react';

export const Header = ({
  addTodo,
  isSubmitting,
  areAllTodosCompleted,
}: {
  addTodo: (title: string) => Promise<void> | undefined;
  isSubmitting: boolean;
  areAllTodosCompleted: boolean;
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={`todoapp__toggle-all ${areAllTodosCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={e => {
          e.preventDefault();
          addTodo(title)
            ?.then(() => setTitle(''))
            .catch(() => {});
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          ref={inputRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
