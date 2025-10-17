// import { ErrorCode } from '../../types/Error';

import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { ErrorCode } from '../../types/ErrorCode';

type Props = {
  todos: Todo[];
  // onToggleAllButton: () => void;
  onShowError: (code: Exclude<ErrorCode, null>) => void;
  onClearError: () => void;
  onSubmit: (title: string) => Promise<void>;
  focusSignal: number;
};

export const Header: React.FC<Props> = ({
  todos,
  // onToggleAllButton,
  onSubmit,
  onShowError,
  onClearError,
  focusSignal,
}) => {
  const [title, setTitle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleField = useRef<HTMLInputElement>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      onShowError('title_empty');
      titleField.current?.focus();
      setTitle('');
      setTimeout(() => {
        onClearError();
      }, 3000);

      return;
    }

    setIsSubmitting(true);

    onSubmit(title.trim())
      .then(() => setTitle(''))
      .catch(() => {})
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (isSubmitting) {
      return;
    }

    if (document.activeElement === titleField.current) {
      return;
    }

    titleField.current?.focus();
  }, [isSubmitting, focusSignal]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed === true),
        })}
        data-cy="ToggleAllButton"
        // onClick={onToggleAllButton}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
