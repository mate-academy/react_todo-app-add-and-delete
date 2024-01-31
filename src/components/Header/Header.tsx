import React, { useEffect, useRef, useState } from 'react';
import { addTodos } from '../../api/todos';
import { ErrorType } from '../../types/type';
import { Todo } from '../../types/Todo';

type Props = {
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  USER_ID: number;
  setPosts: React.Dispatch<React.SetStateAction<Todo[]>>;
  resetError: () => void;
};

export const Header: React.FC<Props> = ({
  setError, USER_ID, setPosts, resetError,
}) => {
  const [change, setChange] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue: string = event.target.value;

    newValue = newValue.replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '');

    setError((prevState: ErrorType) => ({
      ...prevState,
      titleEmpty: false,
    }));

    setChange(newValue);
    resetError();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (change.trim().length === 0) {
      setError((prevState: ErrorType) => ({
        ...prevState,
        titleEmpty: true,
      }));
      resetError();

      return;
    }

    addTodos({
      userId: USER_ID,
      title: change,
      completed: false,
    })
      .then((newPost: Todo) => {
        setPosts((prevState: Todo[]) => [...prevState, newPost]);
      })
      .catch((error) => {
        setError((prevState: ErrorType) => ({
          ...prevState,
          load: true,
        }));
        resetError();
        throw error;
      });

    setChange('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="Toggle All"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          onChange={handleChange}
          value={change}
        />
      </form>
    </header>
  );
};
