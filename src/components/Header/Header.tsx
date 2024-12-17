import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { USER_ID } from '../../api/todos';

type Props = {
  todos: Todo[];
  setErrorMessage: (message: string) => void;
  handleCreateTodo: (newTodo: Omit<Todo, 'id'>) => Promise<void>;
  isLoading: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  setErrorMessage,
  handleCreateTodo,
  isLoading,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const focusInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusInput.current && !isLoading) {
      focusInput.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsSubmitting(true);

    try {
      await handleCreateTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTitle('');
    } catch {
      setErrorMessage('Unable to add a todo');
      throw new Error('Unable to add a todo');
    } finally {
      setIsSubmitting(false);
      if (focusInput.current) {
        focusInput.current.focus();
      }
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.length > 0 && todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={focusInput}
          value={title}
          onChange={handleTitleChange}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
