/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from './types/Todo';
import { deleteTodo, getTodos } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterBy, setFilterBy] = useState<Filter>('All');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoIdsToDelete, setTodoIdsToDelete] = useState<number[]>([]);

  const inputTodoRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    let timeOutId = 0;

    if (error) {
      timeOutId = window.setTimeout(() => setError(''), 3000);
    }

    return () => clearTimeout(timeOutId);
  }, [error]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case 'Active':
          return !todo.completed;

        case 'Completed':
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filterBy]);

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const completedTodosIds = useMemo(
    () => completedTodos.map(todo => todo.id),
    [completedTodos],
  );

  const activeTodosCount = useMemo(
    () => todos.reduce((sum, todo) => (!todo.completed ? sum + 1 : sum), 0),
    [todos],
  );

  const deleteAllCompleted = async () => {
    if (completedTodosIds.length === 0) {
      return;
    }

    try {
      setTodoIdsToDelete(completedTodosIds);

      const results = await Promise.allSettled(
        completedTodosIds.map(id =>
          deleteTodo(id).then(() => {
            setTodos(currentTodos => currentTodos.filter(t => t.id !== id));
          }),
        ),
      );

      const hasError = results.some(result => result.status === 'rejected');

      if (hasError) {
        throw new Error('Unable to delete a todo');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    } finally {
      setTodoIdsToDelete([]);
      inputTodoRef.current?.focus();
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          setError={setError}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
          inputTodoRef={inputTodoRef}
        />

        {todos.length !== 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            setTodos={setTodos}
            setError={setError}
            todoIdsToDelete={todoIdsToDelete}
            inputTodoRef={inputTodoRef}
          />
        )}

        {todos.length !== 0 && (
          <TodoFooter
            setFilterBy={setFilterBy}
            filterBy={filterBy}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodos.length}
            onClick={deleteAllCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
