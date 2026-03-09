import cn from 'classnames';
import { FormEvent, useEffect, useRef } from 'react';

enum Errors {
  Upload = 'upload',
  Title = 'title',
  Add = 'add',
  Delete = 'delete',
  Update = 'update',
  None = '',
}

type Props = {
  allTodosCount: number;
  completedCount: number;
  todoTitle: string;
  setTodoTitle: (todoTitle: string) => void;
  onCreateTodo: (title: string) => void;
  setHasError: (error: Errors) => void;
  isSubmitting: boolean;
  focusTrigger: number;
};

export const TodoHeader: React.FC<Props> = ({
  allTodosCount,
  completedCount,
  todoTitle,
  setTodoTitle,
  onCreateTodo,
  setHasError,
  isSubmitting,
  focusTrigger,
}) => {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (todoTitle.trim()) {
      onCreateTodo(todoTitle.trim());
    } else {
      setHasError(Errors.Title);
    }
  }

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmitting, focusTrigger]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: allTodosCount === completedCount,
        })}
        data-cy="ToggleAllButton"
        disabled={isSubmitting}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          disabled={isSubmitting}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
