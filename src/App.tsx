/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoAppContext } from './TodoAppContext';
import { getTodos, setTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';
import { UserWarning } from './UserWarning';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

const USER_ID = 10660;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(ErrorType.Default);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [complet, setComplet] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processings, setProcessings] = useState<number[]>([]);

  const setError = (error: ErrorType) => {
    setLoadingError(error);
    setTimeout(() => setLoadingError(ErrorType.Default), 3000);
  };

  const loadTodos = async () => {
    try {
      setLoading(true);
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch {
      setError(ErrorType.Load);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = async (title: string) => {
    if (!title) {
      setError(ErrorType.Title);

      return;
    }

    const data = {
      title,
      userId: USER_ID,
      completed: true,
    };

    try {
      setTempTodo({ ...data, id: 0 });
      const todo = await setTodo(data);

      setTodos([...todos, todo]);
    } catch {
      setError(ErrorType.Add);
    } finally {
      setTempTodo(null);
    }
  };

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterType) {
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filterType, complet]);

  const activeTodos = useMemo(() => {
    return visibleTodos.filter(todo => !todo.completed);
  }, [visibleTodos]);

  const removeTodo = async (id: number) => {
    try {
      setProcessings([...processings, id]);
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch {
      setError(ErrorType.Delete);
    } finally {
      setProcessings([]);
    }
  };

  const clearTodos = async () => {
    try {
      const completedTodosId: number[] = [];
      const completedTodos = todos
        .filter(todo => todo.completed)
        .map((item) => {
          completedTodosId.push(item.id);

          return deleteTodo(item.id);
        });

      setProcessings(completedTodosId);

      await Promise.all(completedTodos);
      setTodos(todos.filter(todo => !todo.completed));
    } catch {
      setError(ErrorType.Clear);
    } finally {
      setProcessings([]);
    }
  };

  const contextValue = useMemo(() => {
    return {
      todos,
      loading,
      loadingError,
      filterType,
      setFilterType,
      visibleTodos,
      activeTodos,
      complet,
      setComplet,
      addTodo,
      processings,
      clearTodos,
      removeTodo,
    };
  }, [todos, loading, loadingError, filterType, complet, processings]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoAppContext.Provider value={contextValue}>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header />

          <section
            className="todoapp__main"
            data-cy="TodoList"
          >
            <TransitionGroup>
              {visibleTodos.map((todo: Todo) => (
                <CSSTransition
                  key={todo.id}
                  timeout={300}
                  classNames="item"
                >
                  <TodoItem {...todo} />
                </CSSTransition>
              ))}

              {(tempTodo?.id === 0) && (
                <CSSTransition
                  key={0}
                  timeout={300}
                  classNames="temp-item"
                >
                  <TodoItem {...tempTodo} />
                </CSSTransition>
              )}
            </TransitionGroup>
          </section>

          {todos.length > 0 && (<Footer />)}
        </div>

        <div
          data-cy="ErrorNotification"
          className={classNames(
            'notification is-danger is-light has-text-weight-normal',
            {
              hidden: !loadingError,
            },
          )}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setLoadingError(ErrorType.Default)}
          />

          {loadingError}
          <br />
        </div>
      </div>
    </TodoAppContext.Provider>
  );
};
