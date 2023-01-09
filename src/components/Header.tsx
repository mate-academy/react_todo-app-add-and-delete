import classNames from 'classnames';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { postTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { AuthContext } from './Auth/AuthContext';

type Props = {
  setErrorMessage: (message: string) => void;
  addTodo: (todo: Todo) => void;
  showTempTodo: (tempTodo: Todo | null) => void;
  onError: () => void;
};

export const Header: React.FC<Props> = ({
  setErrorMessage,
  addTodo,
  showTempTodo,
  onError,
}) => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const onInputClick = () => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  };

  const postRequest = async () => {
    if (user) {
      try {
        setIsAdding(true);

        const tempTodo: Todo = {
          id: 0,
          title: inputValue,
          userId: user.id,
          completed: false,
        };

        showTempTodo(tempTodo);

        const data = {
          title: inputValue,
          userId: user.id,
          completed: false,
        };

        const response = await postTodo(data);

        setIsAdding(false);
        showTempTodo(null);
        addTodo(response);
        setInputValue('');
      } catch (error) {
        setErrorMessage('Unable to add a todo');
        onError();
        showTempTodo(null);
        setIsAdding(false);
      }
    }
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.length === 0) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    postRequest();
    setIsFormSubmitted(true);
  };

  useEffect(() => {
    if (isFormSubmitted) {
      onInputClick();
    }
  });

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          'active',
        )}
        aria-label="ToggleAllButton"
      />

      <form onSubmit={onFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onClick={onInputClick}
          disabled={isAdding}
          onBlur={() => setIsFormSubmitted(false)}
        />
      </form>
    </header>
  );
};
