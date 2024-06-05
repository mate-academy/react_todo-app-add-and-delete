import React, { useState } from 'react';

import { useEffect } from 'react';
import { Todo } from '../types/Todo';
import { errors } from '../constans/Errors';
import { USER_ID } from '../api/todos';
import classNames from 'classnames';

interface HeaderProps {
  todos: Todo[];
  setError: (error: string | null) => void;
  onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  loadingTodos: number[];
  setLoadingTodos: (loadingTodos: number[]) => void;
}
export const Header: React.FC<HeaderProps> = ({
  todos,
  setError,
  onSubmit,
  isSubmitting,
  setIsSubmitting,
  inputRef,
  loadingTodos,
  setLoadingTodos,
}) => {
  const [newTodo, setNewTodo] = useState('');
  const reset = () => setNewTodo('');

  useEffect(() => {
    if (!isSubmitting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmitting, inputRef]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
    setError(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodo.trim();

    if (trimmedTitle.length === 0) {
      setError(errors.empty);
      setTimeout(() => setError(null), 3000);

      return;
    }

    setLoadingTodos([...loadingTodos, 0]);
    setIsSubmitting(true);

    onSubmit({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    })
      .then(reset)
      .finally(() => {
        setLoadingTodos(loadingTodos.filter(todoId => todoId !== 0));
        setIsSubmitting(false);
      });
  };

  const allCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className={classNames('todoapp__new-todo', {
            'is-loading': isSubmitting,
          })}
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleTitleChange}
          ref={inputRef}
          disabled={isSubmitting}
          autoFocus
        />
      </form>
    </header>
  );
};
