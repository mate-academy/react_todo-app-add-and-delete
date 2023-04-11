/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useMemo,
  // useRef,
} from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { ErrorType } from './enums/Errors';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Loader } from './components/Loader/Loader';
import { TodoFilter } from './components/Todo/TodoFilter';
import { FilterType } from './types/FilterType';
import { getFilteredTodos } from './helpers/GetTodosFiltered';

const USER_ID = 6981;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isListLoading, setListLoading] = useState(false);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [activeTodos, completedTodosCount] = useMemo(
    () => [
      todos.filter(({ completed }) => !completed).length,
      todos.filter(({ completed }) => completed).length,
    ],
    [todos],
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const closeError = () => {
    setErrorMessage('');
  };

  async function getTodosFromServer() {
    setListLoading(true);
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage(ErrorType.UnableToLoad);
    }

    setListLoading(false);
  }

  useEffect(() => {
    setErrorMessage('');
    getTodosFromServer();
    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  const visibleTodos = getFilteredTodos(todos, filterType);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = async (title: string) => {
    setDisabledInput(true);

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    if (query.trim() === '') {
      Notify
        .failure(ErrorType.EmptyQuery);
      setDisabledInput(false);
      setQuery('');
    } else {
      setTempTodo({ ...newTodo, id: 0 });

      try {
        const result = await createTodo(newTodo);

        setTodos((state) => [...state, result] as Todo[]);
      } catch (error) {
        setErrorMessage(ErrorType.UnableToAdd);
      } finally {
        setDisabledInput(false);
        setTempTodo(null);
        setQuery('');
      }
    }
  };

  const removeTodo = async (id: number) => {
    try {
      setLoadingIds(state => [...state, id]);
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(ErrorType.UnableToRemove);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setLoadingIds([]);
    }
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(todos.filter(task => !task.completed));
        })
        .catch(() => {
          setErrorMessage(ErrorType.UnableToClear);
        });
    });
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className="todoapp__toggle-all active"
          />

          <form onSubmit={() => addTodo(query)}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={handleQueryChange}
              disabled={disabledInput}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {isListLoading ? (
            <Loader />
          ) : (
            todos.length > 0 && (
              <TodoList
                todos={visibleTodos}
                tempTodo={tempTodo}
                onDelete={removeTodo}
                loadingIds={loadingIds}
              />
            )
          )}
        </section>

        {todos && (
          <TodoFilter
            filterType={filterType}
            onFilterChange={setFilterType}
            todosLeftActive={activeTodos}
            onClearCompleted={clearCompleted}
            completedTodosCount={completedTodosCount}
          />
        )}
      </div>
      <div
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={closeError}
        />
        {errorMessage}
      </div>
    </div>
  );
};
