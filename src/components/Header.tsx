import {
  FC, useEffect, useRef, useState, ChangeEvent, FormEvent, useContext,
} from 'react';
import { AppContext } from '../context/AppContext';
import { USER_ID } from '../USER_ID';
import { postTodo } from '../api/todos';

export const Header: FC = () => {
  const [inputValue, setInputValue] = useState('');
  const { setErrorMessage, setShowError } = useContext(AppContext);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handlInputSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      setErrorMessage('Title should not be empty');
      setShowError(true);

      return;
    }

    postTodo(USER_ID, {
      id: 99999999,
      userId: USER_ID,
      title: inputValue,
      completed: false,
    });
  };

  const todoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (todoInputRef.current) {
      todoInputRef.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={handlInputSubmit}
      >
        <input
          value={inputValue}
          onChange={handleInputChange}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={todoInputRef}
        />
      </form>
    </header>
  );
};
