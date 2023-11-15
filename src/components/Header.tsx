/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import * as todoService from '../api/todos';
import { TodoError } from '../types/TodoError';
import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/userId';

type Props = {
  setErrorMessage: (message: TodoError) => void;
  setIsShowError: (value: boolean) => void;
  todos: Todo[];
  setTodos: (value: Todo[]) => void;
  setTempTodo: (value: Todo | null) => void;
};

export const Header: React.FC<Props> = ({
  setErrorMessage,
  setIsShowError,
  todos,
  setTodos,
  setTempTodo,
}) => {
  const [title, setTitle] = useState('');
  const [isDisabledTitle, setIsDisabledTitle] = useState(false);

  const titleFocus = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (titleFocus.current) {
      titleFocus.current.focus();
    }
  }, [title, todos.length]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(TodoError.ErrorOfEmptyTitle);
      setIsShowError(true);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setIsDisabledTitle(true);

    setTempTodo(newTodo);

    todoService.createTodo(newTodo)
      .then(item => {
        setTodos([...todos, item]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(TodoError.ErrorOfAdd);
        setIsShowError(true);
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabledTitle(false);
      });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.length,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleFocus}
          disabled={isDisabledTitle}
          value={title}
          onChange={handleTitleChange}
        />
      </form>
    </header>
  );
};
