/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef } from 'react';
import cn from 'classnames';
import { ADDING_ERROR, TITLE_ERROR, USER_ID } from '../utils/constants';
import { addTodo } from '../api/todos';
import { Todo } from '../types/Todo';

interface Props {
  activeLength: number;
  todosLength: number;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  errorHandler: (str: string) => void;
  tempTodo: Todo | null;
}

export const Header: React.FC<Props> = ({
  activeLength,
  todosLength,
  setTodos,
  setTempTodo,
  errorHandler,
  tempTodo,
}) => {
  const titleRef = useRef<HTMLInputElement | null>(null);

  const formSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    titleRef.current?.focus();

    const validTitle = titleRef.current?.value.trim() !== '';

    if (!validTitle) {
      errorHandler(TITLE_ERROR);
    } else {
      const newTodo = {
        title: (titleRef.current as HTMLInputElement).value,
        userId: +USER_ID,
        completed: false,
        id: 0,
      };

      setTempTodo(newTodo);

      addTodo(USER_ID, newTodo)
        .then((todo) => {
          setTodos((prevTodos) => [...prevTodos, todo]);
          (titleRef.current as HTMLInputElement).value = '';
          setTempTodo(null);
        })
        .catch(() => {
          errorHandler(ADDING_ERROR);
        })
        .finally(() => {
          setTempTodo(null);
        });
    }
  };

  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${cn({ active: activeLength === 0 })}`}
        />
      )}

      <form onSubmit={(event) => formSubmit(event)}>
        <input
          ref={titleRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          readOnly={!!tempTodo}
        />
      </form>
    </header>
  );
};
