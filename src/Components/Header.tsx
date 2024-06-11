import React, { RefObject, useState } from 'react';
import { USER_ID, postTodo } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  inputRef: RefObject<HTMLInputElement>;
  setErrorMessage: (value: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: (value: Todo | null) => void;
};

export const Header: React.FC<Props> = ({
  inputRef,
  setErrorMessage,
  setTodos,
  setTempTodo,
}) => {
  const [input, setInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedInput = input.trim();

    if (normalizedInput.length === 0) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    setIsAdding(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: normalizedInput,
      completed: false,
    });

    postTodo({
      userId: USER_ID,
      title: normalizedInput,
      completed: false,
    })
      .then(data => {
        setTempTodo(null);
        setTodos(prevTodos => [...prevTodos, data]);
        setInput('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(() => {
        setTempTodo(null);
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsAdding(false);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
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
          value={input}
          onChange={handleInputChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
