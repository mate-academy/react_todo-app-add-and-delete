import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TempTodo } from '../../types/TempTodo';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  addTodoOnServer: (title: string) => void;
  todos: Todo[];
  toggleAllTodos: (condition: boolean) => void;
  handleErrors: (errorType: ErrorMessages) => void;
  saveTempTodo: (todo: TempTodo) => void;
  isMainInputDisabled: boolean,
};

export const Header: React.FC<Props> = React.memo(({
  addTodoOnServer,
  todos,
  toggleAllTodos,
  handleErrors,
  saveTempTodo,
  isMainInputDisabled,
}) => {
  const areAllTodosDone = todos.every((todo) => todo.completed);
  const [title, setTitle] = useState('');
  const [isEverythingDone, setIsEverythingDone] = useState(areAllTodosDone);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const resetForm = () => {
    setTitle('');
    handleErrors(ErrorMessages.None);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      handleErrors(ErrorMessages.EmptyInput);

      return;
    }

    addTodoOnServer(trimmedTitle);
    saveTempTodo({
      id: 0,
      title,
    });
    resetForm();
  };

  const handleSelectAllTodos = (isEverythingCompleted: boolean) => {
    setIsEverythingDone(!isEverythingCompleted);
    toggleAllTodos(isEverythingCompleted);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        aria-label="button"
        onClick={() => handleSelectAllTodos(isEverythingDone)}
        className={classNames('todoapp__toggle-all', {
          active: !isEverythingDone,
        })}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
          disabled={isMainInputDisabled}
        />
      </form>
    </header>
  );
});
