/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo } from './api/todos';
import { useState } from 'react';
import type { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import Errors from './components/Errors';
import Task from './components/Task';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const unCompleted = todos.filter(todo => !todo.completed);
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const visibleTodos = todos.filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  // turning API into array

  useEffect(() => {
    setError('');

    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => setError('Unable to load todos'));
  }, []);

  // error handler nad timer

  useEffect(() => {
    if (!error) {
      return;
    }

    const errorTime = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(errorTime);
  }, [error]);

  // starting focus/
  const textFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tempTodo === null) {
      textFocus.current?.focus();
    }
  }, [tempTodo]);

  const formHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const trimTitle = title.trim();

    if (!trimTitle) {
      setError('Title should not be empty');

      return;
    }

    const addingTodo = addTodo(trimTitle);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimTitle,
      completed: false,
    });

    addingTodo
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
      });
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
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={formHandler}>
            <input
              ref={textFocus}
              data-cy="NewTodoField"
              value={title}
              onChange={event => setTitle(event.target.value)}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        {todos.length > 0 && <TodoList todos={visibleTodos} />}

        {todos.length > 0 && (
          <Footer
            unCompletedCount={unCompleted.length}
            filter={filter}
            setFilter={setFilter}
            hasCompletedTodos={hasCompletedTodos}
          />
        )}

        {tempTodo && (
          <Task todo={tempTodo} isLoading />
          
        )}
        
      </div>
      <Errors error={error} setErrors={setError} />
    </div>
  );
};
