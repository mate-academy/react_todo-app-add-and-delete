import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import { ErrorNotificationMessage } from '../../types/ErrorNotificationMessage';

interface HeaderProps {
  inputForAddTodo: string;
  onChangeInput: (inputForAddTodo: string) => void;
  addTodo: ({ title, completed, userId }: Omit<Todo, 'id'>) => Promise<void>;
  onErrorMessage: (errorMessage: ErrorNotificationMessage) => void;
  todosLength: number;
}

export const Header: React.FC<HeaderProps> = ({
  inputForAddTodo,
  onChangeInput,
  addTodo,
  onErrorMessage,
  todosLength,
}) => {
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isDisabledInput, todosLength]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsDisabledInput(true);

    if (inputForAddTodo.trim().length <= 0) {
      onErrorMessage(ErrorNotificationMessage.TitleShouldNotBeEmpty);
      setIsDisabledInput(false);

      return;
    }

    try {
      await addTodo({
        title: inputForAddTodo.trim(),
        completed: false,
        userId: USER_ID,
      });
    } catch (error) {
      onErrorMessage(ErrorNotificationMessage.UnableToAddTodos);
    } finally {
      setIsDisabledInput(false);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form method="POST" onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputForAddTodo}
          onChange={event => onChangeInput(event.target.value)}
          disabled={isDisabledInput}
        />
      </form>
    </header>
  );
};
