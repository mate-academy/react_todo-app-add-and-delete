import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { Errors } from '../../types/Errors';
import { USER_ID } from '../../api/todos';

type Props = {
  todos: Todo[];
  showError: (error: Errors) => void;
  onAddTodo: (todo: Omit<Todo, 'id'>) => Promise<void>;
  onToogleAll: (completed: boolean) => void;
  focusInput: boolean;
  setFocusInput: (value: boolean) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  showError,
  onAddTodo,
  onToogleAll,
  focusInput,
  setFocusInput,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') {
      showError(Errors.EmptyTitle);

      return;
    }

    setIsLoading(true);

    try {
      await onAddTodo({
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      });

      setTitle('');
      setButtonVisible(true);
    } catch (error) {
      showError(Errors.AddTodo);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inputRef.current && focusInput) {
      inputRef.current.focus();
      setFocusInput(false);
    }
  }, [isLoading, focusInput, setFocusInput]);

  useEffect(() => {
    setButtonVisible(todos.length > 0);
  }, [todos]);

  const areAllTodosCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const handleToggleAll = () => {
    onToogleAll(!areAllTodosCompleted);
  };

  return (
    <header className="todoapp__header">
      {buttonVisible && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
          disabled={isLoading}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={handleChangeInput}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
