import React, { useState } from 'react';
import classNames from 'classnames';
import { USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  addTodoOnServer: (todo: Todo) => void;
  todos: Todo[];
  toggleAllTodos: (condition: boolean) => void;
  handleErrors: (errorType: ErrorMessages) => void;
};

export const Header: React.FC<Props> = ({
  addTodoOnServer,
  todos,
  toggleAllTodos,
  handleErrors,
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      handleErrors(ErrorMessages.EmptyInput);

      return;
    }

    const newTodoInd = Math.max(...todos.map((todo) => todo.id)) + 1;

    const newTodo: Todo = {
      title: normalizedTitle,
      userId: USER_ID,
      completed: false,
      id: newTodoInd,
    };

    addTodoOnServer(newTodo);
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
        />
      </form>
    </header>
  );
};
