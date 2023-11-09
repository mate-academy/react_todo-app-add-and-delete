import React, { useRef, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { createTodo } from '../../utils/todos';

type Props = {
  query: string,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setQuery: (value: string) => void,
  setError: (value: string) => void,
  setTempTodo: (value: Todo | null) => void,
  setIsHiddenClass: (value: boolean) => void,
};

export const Header: React.FC<Props> = ({
  query,
  setTodos,
  setQuery,
  setError,
  setTempTodo,
  setIsHiddenClass,
}) => {
  const [isDisable, setIsDisable] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDisable]);

  const HandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsDisable(true);

    const preparedQuery = query.trim();

    if (!preparedQuery) {
      setError('Title should not be empty');
      setIsHiddenClass(false);
      setIsDisable(false);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: preparedQuery,
      completed: false,
      userId: 11830,
    };

    const tempoTodo: Todo = {
      ...newTodo,
      id: 0,
    };

    setTempTodo(tempoTodo);

    try {
      const todoFromServer = await createTodo(newTodo);

      setTodos((prev: Todo[] | []) => ([...prev, todoFromServer]));
      setTempTodo(null);
      setQuery('');
    } catch (error) {
      setError('Unable to add a todo');
      setIsHiddenClass(false);
      setTempTodo(null);
    } finally {
      setIsDisable(false);
    }
  };

  const HandleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    setQuery(inputValue);
  };

  return (
    <header className="todoapp__header">

      {/* eslint-disable jsx-a11y/control-has-associated-label  */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={HandleSubmit}
      >
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={HandleInput}
          disabled={isDisable}
        />
      </form>
    </header>
  );
};
