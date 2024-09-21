import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todosLength: number;
  userId: number;
  onSubmit: (v: Todo) => Promise<void>;
  onError: (v: string) => void;
  onTemp: (v: Todo | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  todosLength,
  userId,
  onSubmit,
  onError = () => {},
  onTemp,
  inputRef,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const reset = () => {
    setTitle('');
  };

  const submitTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normilizeTitle = title.toLowerCase().trim();

    if (normilizeTitle === '') {
      onError('Title should not be empty');

      return;
    }

    const newTempTodo = {
      id: 0,
      userId,
      title: title.trim(),
      completed: false,
    };

    onTemp(newTempTodo);

    setIsSubmitting(true);

    onSubmit(newTempTodo)
      .then(() => {
        reset();

        onTemp(null);
      })
      .finally(() => {
        setIsSubmitting(false);

        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}

      {todosLength !== 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={submitTodo} onReset={reset}>
        <input
          ref={inputRef}
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
