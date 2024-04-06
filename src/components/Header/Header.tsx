import cn from 'classnames';
import React, { FC, useEffect, useRef, useState } from 'react';
import * as serviceTodos from '../../api/todos';
import { USER_ID } from '../../api/todos';
import { useTodos } from '../../lib/TodosContext';
import { ErrorText } from '../../types/ErrorText';

export const Header: FC = () => {
  const {
    setProcessTodoIds,
    todos,
    setErrorMessage,
    setTodos,
    setTempTodo,
    setIsLoading,
    isLoading,
  } = useTodos();
  const [title, setTitle] = useState('');
  const inputTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && inputTitleRef.current) {
      inputTitleRef.current.focus();
    }
  }, [isLoading]);

  const addTodo = async () => {
    const titleTrimmed = title.trim();

    if (!titleTrimmed) {
      setErrorMessage(ErrorText.EmptyErr);

      setTimeout(() => {
        setErrorMessage(ErrorText.NoErr);
      }, 2000);

      return;
    }

    const newTodo = {
      id: 0,
      title: titleTrimmed,
      completed: false,
      userId: USER_ID,
    };

    setProcessTodoIds(prevState => [...prevState, newTodo.id]);
    setTempTodo(newTodo);

    try {
      setIsLoading(true);
      const data = await serviceTodos.createTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, data]);
      setTitle('');
    } catch (error) {
      setErrorMessage(ErrorText.AddErr);
      setTimeout(() => {
        setErrorMessage(ErrorText.NoErr);
        setTitle(title);
      }, 2000);
    } finally {
      setProcessTodoIds(prev => prev.filter(id => id !== newTodo.id));
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(ErrorText.NoErr);
    addTodo();
    inputTitleRef.current?.focus();
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(el => el.completed),
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputTitleRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
