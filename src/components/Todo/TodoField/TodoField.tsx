import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../../types/Todo';
import { USER_ID } from '../../../api/todos';

type Props = {
  unCompletedTodos: number;
  todosLength: number;
  setErrorMessage: (message: string) => void;
  setLoading?: (bool: boolean) => void;
  addPost: (title: string) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (bool: boolean) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  shouldFocus: boolean;
  setShouldFocus: (shouldFocus: boolean) => void;
};

export const TodoField: React.FC<Props> = ({
  unCompletedTodos,
  todosLength,
  setErrorMessage = () => {},
  addPost,
  isLoading,
  setIsLoading,
  setTempTodo,
  shouldFocus,
  setShouldFocus,
}) => {
  const [value, setValue] = useState('');
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
      setShouldFocus(false);
    }
  }, [setShouldFocus]);

  useEffect(() => {
    if (titleField.current && shouldFocus) {
      titleField.current.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus, setShouldFocus]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: value,
      completed: false,
    });
    addPost(value.trim())
      .then(() => {
        setValue('');
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
        setShouldFocus(true);
      });
  };

  const onKeyDownHandle = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (value.trim().length === 0) {
        setErrorMessage('Title should not be empty');

        return;
      }

      handleSubmit(event);
    }

    if (event.key === 'Escape') {
      setValue('');
      (event.target as HTMLInputElement).blur();
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todosLength - unCompletedTodos === todosLength,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          value={value}
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          disabled={isLoading}
          placeholder="What needs to be done?"
          onChange={event => setValue(event.target.value)}
          onKeyDown={onKeyDownHandle}
        />
      </form>
    </header>
  );
};
