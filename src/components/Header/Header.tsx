/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { TodosContext, USER_ID } from '../Store/Store';
import { Todo } from '../../types/Todo';

type Props = {};

export const Header: React.FC<Props> = React.memo(() => {
  const {
    todos,
    isCompletedAll,
    setIsCompletedAll,
    setTempItem,
    addTodo,
    errorMessage,
    setErrorMessage,
    setCount,
    added,
    disabled,
    setDisabled,
  } = useContext(TodosContext);

  const [title, setTitle] = useState('');
  const inputAutoFocus = useRef<HTMLInputElement>(null);

  const hasToggle = todos.length > 0;

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const addTempItem = useCallback((newTodo: Todo) => {
    setTempItem(newTodo);
  }, [setTempItem]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');
      setCount((currentCount) => currentCount + 1);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    addTempItem(newTodo);
    addTodo(newTodo);
    setDisabled(true);
  };

  useEffect(() => {
    if (added) {
      setTitle('');
    }
  }, [added]);

  const handleCompletedAll = () => {
    setIsCompletedAll(!isCompletedAll);
  };

  useEffect(() => {
    if (inputAutoFocus.current) {
      inputAutoFocus.current.focus();
    }
  }, [errorMessage, todos.length]);

  return (
    <header className="todoapp__header">
      {hasToggle && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isCompletedAll })}
          data-cy="ToggleAllButton"
          onClick={handleCompletedAll}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputAutoFocus}
          value={title}
          onChange={handleTitle}
          disabled={disabled}
        />
      </form>
    </header>
  );
});
