/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

import React, { useEffect, useRef, useState } from 'react';

import * as todoServise from './api/todos';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';

import { Todo } from './types/Todo';
import { Filters } from './types/Filters';

import { NewTodo } from './components/NewTodo';
import { Errors } from './types/Errors';
import { normalizeTitle } from './utils/normilizeTitle';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Default);
  const [filterByField, setFilterByField] = useState<Filters>(Filters.Default);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [selectedTodoId, setSelectedTodoid] = useState<number | null>(null);
  const [completedTodoIds, setCompletedTodoIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [focus, setFocus] = useState<number>(0);

  const [title, setTitle] = useState('');
  const inputFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading) {
      inputFocus.current?.focus();
    }
  }, [loading, focus]);

  const handleShowError = (error: Errors) => {
    setErrorMessage(error);
  };

  useEffect(() => {
    if (errorMessage === Errors.Default) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage(Errors.Default);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    todoServise
      .getTodos()
      .then(setTodos)
      .catch(() => {
        handleShowError(Errors.LoadTodos);
      });
  }, []);

  const handleChangeFilterField = (filterField: Filters) => {
    setFilterByField(filterField);
  };

  const handleDeleteTodo = (todoId: number) => {
    setSelectedTodoid(todoId);
    todoServise
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setFocus(current => current + 1);
      })
      .catch(() => handleShowError(Errors.DeleteTodo))
      .finally(() => {
        setSelectedTodoid(null);
        setCompletedTodoIds([]);
      });
  };

  const handleClearComplatedTodos = () => {
    todos
      .filter(todo => {
        if (todo.completed) {
          setCompletedTodoIds(prev => [...prev, todo.id]);
        }

        return todo.completed === true;
      })
      .forEach(todo => {
        handleDeleteTodo(todo.id);
      });
  };

  const handleSubmitNewTodo = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = normalizeTitle(title);

    if (!normalizedTitle) {
      handleShowError(Errors.EmptyTitle);

      return;
    }

    setErrorMessage(Errors.Default);

    const newTempTodo = {
      id: 0,
      userId: 3884,
      title: normalizedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setLoading(true);

    todoServise
      .createTodo(newTempTodo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => handleShowError(Errors.AddTodo))
      .finally(() => {
        setTempTodo(null);
        setLoading(false);
      });
  };

  const activeTodosCount: number = todos.filter(
    todo => todo.completed === false,
  ).length;

  const todosCount = todos.length;

  const filteredTodos = [...todos].filter(todo => {
    switch (filterByField) {
      case Filters.Default:
        return todo;

      case Filters.Active:
        return todo.completed === false;

      case Filters.Completed:
        return todo.completed === true;

      default:
        return;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          onSubmit={event => handleSubmitNewTodo(event)}
          query={title}
          onSetTitle={query => setTitle(query)}
          activeTodos={activeTodosCount}
          todosQuantity={todosCount}
          onFocus={inputFocus}
          isDisabled={loading}
        />

        {todos.length > 0 && (
          <TodoList
            visibleTodos={filteredTodos}
            creating={tempTodo}
            onDelete={handleDeleteTodo}
            selectedTodo={selectedTodoId}
            completedTodosIds={completedTodoIds}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {(todos.length > 0 || tempTodo) && (
          <Filter
            onChangeFilter={handleChangeFilterField}
            onClear={handleClearComplatedTodos}
            filterField={filterByField}
            completedItemsCount={todos.length - activeTodosCount}
            activeItemsCount={activeTodosCount}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: errorMessage === Errors.Default },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setErrorMessage(Errors.Default);
          }}
        />
        {errorMessage}
        <br />
      </div>
    </div>
  );
};
