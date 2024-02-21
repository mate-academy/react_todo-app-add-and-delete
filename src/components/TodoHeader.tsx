/* eslint-disable no-useless-return */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */

import React, { useContext, useEffect, useRef, useState } from 'react';
import { TodoContext } from '../contexts/TodoContext';
import { ErrorsMessage } from '../types/ErrorsMessage';
import { USER_ID } from '../constants/User';
import * as TodoClient from '../api/todos';

export const TodoHeader = () => {
  const [taskValue, setTaskValue] = useState('');

  const { todos, tempTodo, addTodo, handleSetTempTodo, handleSetErrorMessage } =
    useContext(TodoContext);

  const newTaskInput = useRef<HTMLInputElement>(null);

  const handleSetTaskValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSetErrorMessage(ErrorsMessage.None);

    const newTask = {
      userId: USER_ID,
      title: taskValue.trim(),
      completed: false,
    };

    if (!taskValue.trim()) {
      handleSetErrorMessage(ErrorsMessage.Title);

      return;
    }

    newTaskInput.current?.setAttribute('disabled', 'true');

    handleSetTempTodo({ ...newTask, id: 0 });

    TodoClient.addTodo(newTask)
      .then(todo => {
        addTodo(todo);
        setTaskValue('');
      })
      .catch(() => handleSetErrorMessage(ErrorsMessage.Add))
      .finally(() => {
        newTaskInput.current?.removeAttribute('disabled');
        handleSetTempTodo(null);
      });
  };

  useEffect(() => {
    newTaskInput.current?.focus();
  }, [todos.length, tempTodo]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={newTaskInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={taskValue}
          onChange={event => handleSetTaskValue(event)}
        />
      </form>
    </header>
  );
};
