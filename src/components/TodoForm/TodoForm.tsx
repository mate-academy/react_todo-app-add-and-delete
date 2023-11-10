import React, { useEffect, useRef, useState } from 'react';
// import { Todo } from '../../types/Todo';

type Props = {
  // todos: Todo[];
  onError: (message: string) => void;
  onTodoAdd: (title: string) => Promise<void>;
};

export const TodoForm: React.FC<Props> = ({
  // todos,
  onError,
  onTodoAdd,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isSubmitting]);

  const trimedTitle = todoTitle.trim();

  const handleSubmit = async (event: React.FormEvent) => {
    setIsSubmitting(true);
    event.preventDefault();

    if (!trimedTitle) {
      setTodoTitle('');
      onError('Title should not be empty');
      setIsSubmitting(false);

      return;
    }

    try {
      await onTodoAdd(trimedTitle);
      setTodoTitle('');
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        aria-label="toggle button"
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          disabled={isSubmitting}
          value={todoTitle}
          onChange={(event) => {
            setTodoTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
