/* eslint-disable jsx-a11y/control-has-associated-label */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import classNames from 'classnames';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { TodoList } from './Components/TodoList/TodoList';
import { Status } from './types/TodoFilter';
import { TodoFilter } from './Components/TodoFilter/TodoFilter';
import { TodoItem } from './Components/Todo/TodoItem';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { NewError } from './types/ErrorsList';
import { USER_ID } from './consfig';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterBy, setFilterBy] = useState<Status>(Status.All);
  const [query, setQuery] = useState('');
  const [visibleError, setVisibleError] = useState<NewError | null>(null);
  const [isRemovingCompleted, setIsRemovingCompleted] = useState(false);
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [isUpdatingEveryStatus, setIsUpdatingEveryStatus] = useState(false);

  const visibleTodos = useMemo(() => (
    todos.filter((todo) => {
      switch (filterBy) {
        case Status.Active:
          return !todo.completed;

        case Status.Completed:
          return todo.completed;

        default:
          return true;
      }
    })
  ), [todos, filterBy]);

  const loadTodo = useCallback(async () => {
    const todosFromServer = await getTodos(USER_ID);

    setTodos(todosFromServer);
  }, []);

  const itemsLeft = todos.filter((todo) => !todo.completed).length;
  const isTodosNoEmpty = todos.length > 0;
  const isVisibleError = visibleError !== null;
  const isEveryTotoCompleted = todos.every((todo) => todo.completed);

  useEffect(() => {
    loadTodo();
  }, []);

  const handleFilterChange = useCallback((newFilter: Status) => {
    setFilterBy(newFilter);
  }, []);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const handleSubmit = useCallback(async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (query.trim() === '') {
      setVisibleError(NewError.Title);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: query,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      const createdTodo = await createTodo(newTodo);

      setTodos((prevTodos) => [...prevTodos, createdTodo]);
    } catch (error) {
      setVisibleError(NewError.Add);
    } finally {
      setTempTodo(null);
    }

    setQuery('');
  }, [query]);

  const handleCloseError = useCallback(() => {
    setVisibleError(null);
  }, []);

  const handleRemoveTodo = useCallback(async (todoId: number) => {
    try {
      await client.delete(`/todos/${todoId}`);

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    } catch (error) {
      setVisibleError(NewError.Remove);
    }
  }, []);

  const handleRemoveCompletedTodos = useCallback(async () => {
    setIsRemovingCompleted(true);

    try {
      await Promise.all(
        todos
          .filter((todo) => todo.completed)
          .map((todo) => deleteTodo(todo.id)),
      );

      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
    } catch (error) {
      setVisibleError(NewError.Remove);
    } finally {
      setIsRemovingCompleted(false);
    }
  }, [todos]);

  const handleUpdateTodo = useCallback(async (todoToUptade: Todo) => {
    setUpdatingTodoId(todoToUptade.id);
    const updatedTodo = {
      ...todoToUptade,
      completed: !todoToUptade.completed,
    };

    try {
      await updateTodo(updatedTodo);

      setTodos((prevTodos) => prevTodos.map((todo) => (
        todo.id === todoToUptade.id ? updatedTodo : todo
      )));
    } catch (error) {
      setVisibleError(NewError.Update);
    } finally {
      setUpdatingTodoId(null);
    }
  }, [todos]);

  const handleUpdateAllTodos = useCallback(async () => {
    setIsUpdatingEveryStatus(true);
    try {
      await Promise.all(
        todos.map((todo) => updateTodo({
          ...todo,
          completed: !isEveryTotoCompleted,
        })),
      );

      setTodos((prevTodos) => prevTodos.map((todo) => ({
        ...todo,
        completed: !isEveryTotoCompleted,
      })));
    } catch (error) {
      setVisibleError(NewError.Update);
    } finally {
      setIsUpdatingEveryStatus(false);
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {isTodosNoEmpty && (
            <button
              type="button"
              className={classNames(
                'todoapp__toggle-all', {
                  active: isEveryTotoCompleted,
                },
              )}
              onClick={handleUpdateAllTodos}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          updatingTodoId={updatingTodoId}
          isRemovingCompleted={isRemovingCompleted}
          isUpdatingEveryStatus={isUpdatingEveryStatus}
          isEveryTotoCompleted={isEveryTotoCompleted}
          onTodoRemove={handleRemoveTodo}
          onTodoUpdate={handleUpdateTodo}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isLoadingNewTodo
            onTodoRemove={() => {}}
            onTodoUpdate={() => {}}
          />
        )}

        {isTodosNoEmpty && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${itemsLeft} items left`}
            </span>

            <TodoFilter
              filterBy={filterBy}
              onFilterChange={handleFilterChange}
            />

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              onClick={handleRemoveCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}

        <div
          className="notification is-danger is-light has-text-weight-normal"
          hidden={!isVisibleError}
        >
          <button
            type="button"
            className="delete"
            onClick={handleCloseError}
          />

          <strong>
            {visibleError}
          </strong>
        </div>
      </div>
    </div>
  );
};
