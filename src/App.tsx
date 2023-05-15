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
import { FilterBy } from './utils/FilterBy';
import { TodoFilter } from './Components/TodoFilter/TodoFilter';
import { TodoItem } from './Components/Todo/TodoItem';

const USER_ID = 10341;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [query, setQuery] = useState<string>('');
  const [isTitleEmpty, setIsTitleEmpty] = useState<boolean>(false);
  const [isAddError, setIsAddError] = useState<boolean>(false);
  const [isRemoveError, setIsRemoveError] = useState<boolean>(false);
  const [isRemCompleted, setIsRemCompleted] = useState<boolean>(false);

  const visibleTodos = useMemo(() => (
    todos.filter((todo) => {
      switch (filterBy) {
        case FilterBy.Active:
          return !todo.completed;

        case FilterBy.Completed:
          return todo.completed;

        default:
          return true;
      }
    })
  ), [todos, filterBy]);

  const getTodos = async () => {
    const todosFromServer = await client.get<Todo[]>(`/todos?userId=${USER_ID}`);

    setTodos(todosFromServer);
  };

  const itemsLeft = todos.filter((todo) => !todo.completed).length;
  const isTodosNoEmpty = todos.length > 0;
  const isVisibleError = isTitleEmpty || isAddError;

  useEffect(() => {
    getTodos();
  }, []);

  const handleFilterChange = useCallback((newFilter: FilterBy) => {
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
      setIsTitleEmpty(true);

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: query,
      completed: false,
    });

    const newTodo = {
      userId: USER_ID,
      title: query,
      completed: false,
    };

    try {
      const createdTodo = await client.post<Todo>('/todos', newTodo);

      setTodos((prevTodos) => [...prevTodos, createdTodo]);
    } catch (error) {
      setIsAddError(true);

      return;
    } finally {
      setTempTodo(null);
    }

    setQuery('');
  }, [query]);

  const handleCloseError = useCallback(() => {
    setIsTitleEmpty(false);
    setIsAddError(false);
  }, []);

  const handleRemoveTodo = useCallback(async (todoId: number) => {
    try {
      await client.delete(`/todos/${todoId}`);

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    } catch (error) {
      setIsRemoveError(true);
    }
  }, []);

  const handleRemoveCompletedTodos = useCallback(async () => {
    setIsRemCompleted(true);

    try {
      await Promise.all(
        todos
          .filter((todo) => todo.completed)
          .map((todo) => client.delete(`/todos/${todo.id}`)),
      );

      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
    } catch (error) {
      setIsRemoveError(true);
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
                  active: todos.every((todo) => todo.completed),
                },
              )}
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
          onTodoRemove={handleRemoveTodo}
          isRemCompleted={isRemCompleted}
        />
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            onTodoRemove={handleRemoveTodo}
            isRemovingCompleted={isRemCompleted}
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

          {isTitleEmpty && (<strong>Title can&apos;t be empty</strong>)}
          {isAddError && (<strong>Unable to add a todo</strong>)}
          {isRemoveError && (<strong>Unable to delete a todo</strong>)}
        </div>
      </div>
    </div>
  );
};
