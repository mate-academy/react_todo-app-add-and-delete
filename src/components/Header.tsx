import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  todos: Todo[],
  addNewTodo: (todoTitle: string) => Promise<void>,
  setErrorMessage: (errorMessage: ErrorMessage) => void,
};

export const Header: React.FC<Props> = ({
  todos,
  addNewTodo,
  setErrorMessage,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const allTodosCompleted = todos.every(todo => todo.completed);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim().length) {
      setErrorMessage(ErrorMessage.TITLE);
      setTodoTitle('');

      return;
    }

    try {
      setIsInputDisabled(true);
      await addNewTodo(todoTitle);
    } catch {
      setErrorMessage(ErrorMessage.ADD);
    } finally {
      setIsInputDisabled(false);
      setTodoTitle('');
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          aria-label="toggle"
          className={classNames(
            'todoapp__toggle-all',
            { active: allTodosCompleted },
          )}

        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleInput}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
