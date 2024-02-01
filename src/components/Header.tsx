/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';
import { TodosContext } from '../TodoContext/TodoContext';
import * as todosServices from '../api/todos';
import { USER_ID } from '../variables/UserID';

export const Header: React.FC = () => {
  const {
    addTodo,
    makeAllCompleted,
    todos,
    setErrorMessage,
    setTempTodo,
  } = useContext(TodosContext);

  const [todoTitle, setTodoTitle] = useState('');
  const [disableInput, setDisableInput] = useState(false);

  const isAllTodosCompleted = todos.every(({ completed }) => completed);

  const handleToggleAll = () => {
    makeAllCompleted(todos);
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setDisableInput(true);
    setTempTodo({
      id: 0,
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    });

    todosServices.createTodos({
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    }).then(response => {
      setTodoTitle('');
      addTodo(response);
      setTempTodo(null);
    })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => setDisableInput(false));
    event.preventDefault();
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}

      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        disabled={!isAllTodosCompleted}
        onClick={handleToggleAll}
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={(event) => handleOnSubmit(event)}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          disabled={disableInput}
          onChange={(event) => setTodoTitle(event.currentTarget.value)}
        />
      </form>
    </header>
  );
};
