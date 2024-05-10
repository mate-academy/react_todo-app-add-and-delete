import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { TypeTodo } from '../../types/Todo';
import { USER_ID, createData } from '../../api/todos';

interface Props {
  todos: TypeTodo[];
  inputFocus: boolean;
  allTodosCompleted: boolean;
  setInputFocus: (focus: boolean) => void;
  setErrorMessage: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  setTodos: React.Dispatch<React.SetStateAction<TypeTodo[]>>;
}

export const Header: React.FC<Props> = ({
  todos, inputRef, allTodosCompleted,
  inputFocus, setInputFocus, setErrorMessage,
  setTodos, setIsLoading
}) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const handleCreateNew = async () => {
    if (!title.trim().length) {
      return;
    }

    const maxId = todos.reduce((max, todo) => Math.max(max, todo.id), 0);
    const tempTodo: TypeTodo = {
      id: maxId + 1,
      userId: USER_ID,
      title: title.trim(),
      completed: true,
    };

    setIsLoading(true);
    setIsDisabled(true);
    try {
      await createData(tempTodo);
      setTodos(prevTodos => [...prevTodos, tempTodo]);
      setTitle('');
    } catch (error) {
      setErrorMessage('Failed to add todo');
    } finally {
      setIsLoading(false);
      setIsDisabled(false);
      setInputFocus(true);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (!title) {
        setErrorMessage('Title should not be empty');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);

        return;
      }

      event.preventDefault();
      handleCreateNew();
    }
  };

  const handlePreventSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleInputFocus = () => {
    setInputFocus(true);
  };

  const handleInputBlur = () => {
    setInputFocus(false);
  };

  useEffect(() => {
    if (inputFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputFocus, inputRef]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames("todoapp__toggle-all",
          { "active": allTodosCompleted }
        )}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handlePreventSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleValue}
          onKeyDown={handleKeyPress}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          autoFocus={inputFocus}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
