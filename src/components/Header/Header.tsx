/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { postTodo, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  setTempTodo: (value: Todo) => void,
  setError: (err: Error) => void,
  tempTodo: Todo | null,
};

export const Header: React.FC<Props> = ({
  setTempTodo,
  setError,
  tempTodo,
}) => {
  const [title, setTitle] = useState('');
  const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTitle(value);
  };

  const createTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setError({
        state: true,
        type: ErrorType.EmptyTitle,
      });

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    postTodo(USER_ID, {
      userId: USER_ID,
      title,
      completed: false,
    });

    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all active" />
      <form onSubmit={createTodo}>
        <input
          disabled={!!tempTodo}
          name="title"
          value={title}
          onChange={changeTitle}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
