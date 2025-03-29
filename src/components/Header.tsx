import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { createTodo, USER_ID } from '../api/todos';
import { ErrorType } from '../types/Error';

type Props = {
  todos: Todo[];
  setTodos: (array: Todo[]) => void;
  setError: (value: ErrorType, time?: number) => void;
  setTempTodo: (value: Todo | null) => void;
  tempTodo: Todo | null;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setError,
  setTempTodo,
  tempTodo,
}) => {
  const [title, setTitle] = useState('');
  const inputFocus = useRef<HTMLInputElement>(null);

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(ErrorType.empty_value, 3000);

      return;
    }

    try {
      setTempTodo({ title: title, id: 0, completed: false, userId: USER_ID });
      const newTodo = await createTodo({
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      });

      setTodos([...todos, newTodo]);
      setTitle('');
    } catch (err) {
      setError(ErrorType.adding_error, 3000);
    } finally {
      setTempTodo(null);
    }
  };

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
  }, [tempTodo, todos]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={submitHandler}>
        <input
          ref={inputFocus}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => {
            setTitle(event.target.value);
          }}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
