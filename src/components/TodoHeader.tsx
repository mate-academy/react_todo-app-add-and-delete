import classNames from 'classnames';
import React, { useEffect, useMemo } from 'react';
import { Todo } from '../types/Todo';
import { Errors } from '../enums/Errors';

interface Props {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (error: Errors | null) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  isLoading: boolean;
  setIsLoading: (bool: boolean) => void;
  setFocusInput: (bool: boolean) => void;
  focusInput: boolean;
  clearErrorMessage: () => void;
}

export const TodoHeader: React.FC<Props> = ({
  todos,
  addTodo,
  setErrorMessage,
  setTempTodo,
  isLoading,
  setIsLoading,
  setFocusInput,
  focusInput,
  clearErrorMessage,
}) => {
  const [newTodoTitle, setNewTodoTitle] = React.useState('');

  const inputField = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
      setFocusInput(false);
    }
  }, [setFocusInput]);

  useEffect(() => {
    if (inputField.current && focusInput) {
      inputField.current.focus();
      setFocusInput(false);
    }
  }, [focusInput, setFocusInput]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const onFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    clearErrorMessage();

    if (!newTodoTitle.trim()) {
      setErrorMessage(Errors.EmptyTitle);

      return;
    }

    setIsLoading(true);

    const newTodo = {
      userId: 11946,
      title: newTodoTitle.trim(),
      completed: false,
    };

    const tempTodo = {
      id: 0,
      userId: 11946,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setTempTodo(tempTodo);

    addTodo(newTodo)
      .then(() => {
        setNewTodoTitle('');
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
        setFocusInput(true);
      });
  };

  const isToggleAllChecked = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isToggleAllChecked,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          disabled={isLoading}
          onChange={handleInputChange}
          ref={inputField}
        />
      </form>
    </header>
  );
};
