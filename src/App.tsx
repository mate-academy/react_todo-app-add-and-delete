/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { useTodo } from './hooks/useTodo';
import { ErrorMessage } from './types/ErrorMessage';
import { Todo } from './types/Todo';

const USER_ID = 11340;

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    isChecked,
    setIsChecked,
  } = useTodo();

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LOAD_ERROR));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  setIsChecked(todos.every(todo => todo.completed) && todos.length > 0);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setNewTodoTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTitle = newTodoTitle.trim();

    if (!newTitle) {
      setErrorMessage(ErrorMessage.TITLE_ERROR);
      setNewTodoTitle('');

      return;
    }

    setIsSubmitting(true);

    const newTodoToAdd = {
      id: 0,
      userId: USER_ID,
      title: (newTitle),
      completed: false,
    };

    setTempTodo(newTodoToAdd);

    todoService.addTodo(newTodoToAdd)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.ADD_ERROR);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
        setNewTodoTitle('');
      });
  };

  const handleCheckAllTodos = () => {
    setTodos((prev) => prev.map(todo => ({
      ...todo,
      completed: !isChecked,
    })));
    setIsChecked(!isChecked);
  };

  const activeTodosCounter = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedTodosCounter = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const clearCompletedTodos = () => {
    setTodos(todos.filter(todo => !todo.completed));
    setIsChecked(false);
  };

  const handleDeleteErrorMessage = () => {
    setErrorMessage('');
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: isChecked,
            })}
            onClick={handleCheckAllTodos}
          />

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={handleTitleChange}
              disabled={isSubmitting}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList tempTodo={tempTodo} />

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${activeTodosCounter} item${activeTodosCounter === 1 ? '' : 's'} left`}
              </span>

              <TodoFilter />

              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={clearCompletedTodos}
                disabled={completedTodosCounter < 0}
              >
                {completedTodosCounter > 0 && 'Clear completed'}
              </button>
            </footer>
          </>
        )}
      </div>

      {errorMessage && (
        <div className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
        >
          <button
            type="button"
            className="delete"
            onClick={handleDeleteErrorMessage}
          />
          {errorMessage}
        </div>
      )}
    </div>
  );
};
