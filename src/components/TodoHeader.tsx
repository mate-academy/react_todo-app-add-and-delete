import React, { useState } from 'react';
import { Error, Todo } from '../types/Index';
import * as todosService from '../api/todos';

type Props = {
  todos: Todo[],
  setTodos: (value: Todo[]) => void,
  tempTodo: Todo | null,
  setTempTodo: (value: null | Todo) => void,
  setHasError: (value: Error) => void,
  setLoading: (value: boolean) => void,
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  setTodos,
  tempTodo,
  setTempTodo,
  setHasError,
  setLoading,
}) => {
  const [title, setTitle] = useState('');

  const USER_ID = 11041;

  const handleTodoAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (title.trim() === '') {
      setHasError(Error.EMPTY);

      return;
    }

    setTempTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
      id: 0,
    });

    todosService.addTodos({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    }).then(newTodo => {
      setTodos([...todos, newTodo]);
    }).catch(() => setHasError(Error.ADD))
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });

    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons are active only if there are some active todos */}
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleTodoAdd}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
