import React, { useEffect, useRef, useState } from 'react';
import { ErrorMesagges } from '../types/enums';
import { createTodos } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  setErrorMessage: (value: ErrorMesagges) => void;
  setTempTodo: (value: Todo | null) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const Header: React.FC<Props> = ({
  setErrorMessage,
  setTempTodo,
  setTodos,
}) => {
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isDisabledInput, setIsDisabledInput] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isDisabledInput) {
      inputRef.current?.focus();
    }
  }, [isDisabledInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) {
      setErrorMessage(ErrorMesagges.EmptyTitle);

      return;
    }

    setIsDisabledInput(true);
    try {
      const createTempTodo = {
        id: 0,
        userId: import.meta.env.VITE_USER_ID,
        title: inputQuery,
        completed: false,
      };

      //create tempTodo
      setTempTodo(createTempTodo);

      //send data to server
      const newTodo = await createTodos(inputQuery.trim());

      setTodos(prev => [...prev, newTodo]);
      setInputQuery('');
    } catch (error) {
      setErrorMessage(ErrorMesagges.UnableAdd);
    } finally {
      setIsDisabledInput(false);
      setTempTodo(null);
    }
  };

  return (
    <header className="todoapp__header">
      {/* TODO: this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          disabled={isDisabledInput}
        />
      </form>
    </header>
  );
};

export default Header;
