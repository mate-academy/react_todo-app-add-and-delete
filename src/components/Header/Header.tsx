import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID, createTodo } from '../../api/todos';

type HeaderProps = {
  onSubmit: (newTodo: Todo) => void;
  onErrorMessage: (error: string) => void;
  onTempTodo: (tempTodo: Todo | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<HeaderProps> = ({
  onSubmit,
  onErrorMessage,
  onTempTodo,
  inputRef,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [submitting]);

  const handleTodoTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
  };

  function handleReset() {
    setTodoTitle('');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      onErrorMessage('Title should not be empty');

      return;
    }

    setSubmitting(true);

    onTempTodo({
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
      id: 0,
    });

    createTodo({
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        onSubmit(newTodo);
        handleReset();
        onTempTodo(null);
      })
      .catch(() => {
        onErrorMessage('Unable to add a todo');
        onTempTodo(null);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: false,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTodoTitle}
          disabled={submitting}
        />
      </form>
    </header>
  );
};
