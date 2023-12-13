import React, { useRef, useEffect, useState } from 'react';
import cn from 'classnames';
import { Errors } from '../../../types/Errors';
import { Todo } from '../../../types/Todo';
import { postTodo } from '../../../api/todos';

interface HeaderProps {
  activeTodos: number;
  setErrorMessage: (newMessage: Errors) => void;
  setTempTodo: (loadingTodo: Todo | null) => void;
  userId: number;
  handleTodoAdded: (todo: Todo) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTodos,
  setErrorMessage,
  setTempTodo,
  userId,
  handleTodoAdded,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputTitle, setInputTitle] = useState('');
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, [disabled]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(Errors.NoError);
    setInputTitle(event.target.value);
  };

  const handleSubmitChanges = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = inputTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(Errors.Empty);
    } else {
      setDisabled(true);

      setTempTodo({
        id: 0,
        userId,
        title: inputTitle,
        completed: false,
      });

      postTodo(userId, trimmedTitle)
        .then((response) => {
          handleTodoAdded({
            id: response.id,
            userId: response.userId,
            title: response.title,
            completed: response.completed,
          });
        })
        .catch(() => setErrorMessage(Errors.Add))
        .finally(() => {
          setDisabled(false);
          setInputTitle('');
          setTempTodo(null);
        });
    }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: activeTodos,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmitChanges}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disabled}
          ref={inputRef}
          value={inputTitle}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
