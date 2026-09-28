import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

type Props = {
  onAddTodo: (title: string) => Promise<void>;
  isSubmitting: boolean;
  todosCount: number;
  activeTodosCount?: number;
  loadingTodosCount?: number;
};

export const Header: React.FC<Props> = ({
  onAddTodo,
  isSubmitting,
  todosCount,
  activeTodosCount = 0,
  loadingTodosCount = 0,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSubmitting && loadingTodosCount === 0) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, loadingTodosCount]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      onAddTodo(title).catch(() => {});

      return;
    }

    onAddTodo(title)
      .then(() => {
        setTitle('');
      })
      .catch(() => {});
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todosCount > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeTodosCount === 0,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
