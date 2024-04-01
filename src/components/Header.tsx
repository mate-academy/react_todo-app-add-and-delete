import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { USER_ID, addTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { useTodosContext } from './useTodosContext';

export const Header: React.FC = () => {
  const {
    todos,
    setTodos,
    setTempTodo,
    handleError,
    setLoadingTodosIds,
    isInputFocused,
    setIsInputFocused,
  } = useTodosContext();
  const [title, setTitle] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const focusField = useRef<HTMLInputElement>(null);
  const allCompleted = useMemo(() => {
    return todos.every((todo: Todo) => todo.completed);
  }, [todos]);

  useEffect(() => {
    if (isInputFocused && focusField.current) {
      focusField.current.focus();
      setIsInputFocused(false);
    }
  }, [isInputFocused, setIsInputFocused]);

  const handleKeyPress = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);

    if (!title.trim().length) {
      handleError('Title should not be empty');
      setIsSubmitted(false);

      return;
    }

    const newTodo = {
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    addTodo(newTodo)
      .then(todoFromResponse => {
        setTodos(currentTodos => [...currentTodos, todoFromResponse]);
        setTitle('');
      })
      .catch(() => handleError('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setLoadingTodosIds([]);
        setIsInputFocused(true);
        setIsSubmitted(false);
      });

    const tempTodo0 = {
      id: 0,
      ...newTodo,
    };

    setTempTodo(tempTodo0);
    setLoadingTodosIds(currentIds => [...currentIds, tempTodo0.id]);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTitle('');
      setIsInputFocused(true);
    }
  };

  const toggleAllTodos = () => {
    setTodos(currentTodos =>
      currentTodos.map((todo: Todo) => ({
        ...todo,
        completed: !allCompleted,
      })),
    );
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={toggleAllTodos}
        disabled={todos.length === 0}
      />

      <form onSubmit={handleKeyPress}>
        <input
          type="text"
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={focusField}
          value={title}
          onChange={event => setTitle(event.target.value)}
          onKeyUp={handleKeyUp}
          disabled={isSubmitted}
        />
      </form>
    </header>
  );
};
