import { FormEvent, useEffect } from 'react';
import cn from 'classnames';

interface Props {
  title: string;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleTitleChange: (title: string) => void;
  notCompletedTodosCount: number;
  isSubmitting: boolean;
  loading: boolean;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

export const Header = ({
  title,
  handleSubmit,
  handleTitleChange,
  notCompletedTodosCount,
  isSubmitting,
  loading,
  inputRef,
}: Props) => {
  useEffect(() => {
    if (!loading && !isSubmitting) {
      inputRef.current?.focus();
    }
  }, [inputRef, loading, isSubmitting]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}

      <button
        type="button"
        disabled={isSubmitting}
        className={cn('todoapp__toggle-all', {
          active: notCompletedTodosCount === 0,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={loading || isSubmitting}
          data-cy="NewTodoField"
          type="text"
          value={title}
          onChange={event => handleTitleChange(event.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
