import React, { useEffect, useRef, useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import * as postService from '../api/todos';
import { USER_ID } from '../utils/USER_ID';

export const Header: React.FC = () => {
  const [title, setTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputDisabled]);

  const {
    todos,
    setTodos,
    setErrorMessage,
    setTempTodo,
  } = useTodos();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');

    setTitle(event.target.value.trim());
  };

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsInputDisabled(true);
    setErrorMessage('');

    const trimedTitle = title.trimStart();

    setTempTodo({
      id: 0,
      userId: 0,
      title: trimedTitle,
      completed: false,
    });

    postService.addTodos(
      { title: trimedTitle, completed: false, userId: USER_ID },
    ).then((newTodo) => {
      setTitle('');

      setTodos(prevTodos => {
        if (prevTodos) {
          return [...prevTodos, newTodo];
        }

        return null;
      });
    }).catch(() => {
      setErrorMessage('Unable to add a todo');
    }).finally(() => {
      setIsInputDisabled(false);
      setTempTodo(null);
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos?.length && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={(event) => addTodo(event)}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          disabled={isInputDisabled}
          onChange={handleTitleChange}
        />
      </form>
    </header>
  );
};
