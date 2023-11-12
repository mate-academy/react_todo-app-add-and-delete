/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';

// import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { FilterParam } from './types/FilterParam';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoItem } from './components/TodoItem';

const USER_ID = 11467;

export const App: React.FC = () => {
  const [filterParam, setFilterParam] = useState(FilterParam.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState('');
  const [request, setRequest] = useState(true);
  const [title, setTitle] = useState('');
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [isLoaderActive, setIsLoaderActive] = useState(false);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(createdTodo => {
        setTodos(createdTodo);
        setRequest(false);
      })
      .catch((someError) => {
        setError('Unable to load todos');
        setRequest(false);
        // eslint-disable-next-line no-console
        console.warn(someError);
      });
    const timerId = setTimeout(() => {
      setError('');
    }, 4000);

    return () => {
      clearInterval(timerId);
    };
  }, []);
  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setRequest(true);

    todoService.createTodo(newTodo)
      .then((createdTodo) => {
        setTodos((prevTodos) => [...prevTodos, createdTodo]);
        setTitle('');
        setLoadingTodosIds([]);
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTimeout(() => setError(''), 3000);
        setLoadingTodosIds([]);
      })
      .finally(() => {
        setRequest(false);
        setTempTodo(null);
      });
    const temp: Todo = Object.assign(newTodo, { id: 0 });

    setTempTodo(temp);
  };

  const deleteTodo = useCallback((id: number) => {
    setLoadingTodosIds([id]);
    setIsLoaderActive(true);

    todoService.deleteUserTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== id));
        setLoadingTodosIds([]);
      })
      .catch(() => {
        setError('Unable to delete a todo');
        setLoadingTodosIds([]);
      })
      .finally(() => {
        setLoadingTodosIds([id]);
        setIsLoaderActive(false);
      });
  }, []);

  // function updateTodo(updatedTodo: Todo) {
  //   setTodos(currentTodo => {
  //     const newTodo = [...currentTodo];
  //     const index = newTodo.findIndex(todo => todo.id === updatedTodo.id);

  //     newTodo.splice(index, 1, updatedTodo);

  //     return newTodo;
  //   });
  // }

  let isOneTodoCompleted = useMemo(() => todos
    .some(({ completed }) => completed), [todos]);

  const filterTodos = useMemo(() => todos
    .filter(({ completed }) => {
      switch (filterParam) {
        case FilterParam.Active:
          return !completed;
        case FilterParam.Completed:
          return completed;
        default:
          return true;
      }
    }), [todos, filterParam]);

  const handleClearCompleted = () => {
    const deletePromises = todos
      .filter(({ completed }) => completed)
      .map(({ id }) => deleteTodo(id));

    Promise.all(deletePromises)
      .then(() => {
        return todoService.getTodos(USER_ID);
      })
      .then((updatedTodos) => {
        setTodos(updatedTodos);
      })
      .catch(() => {
        isOneTodoCompleted = false;
        setError('Unable to delete a todo');
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onSubmit={addTodo}
          todo={filterTodos.length > 0 ? filterTodos[0] : null}
          userId={USER_ID}
          todos={filterTodos}
          error={error}
          request={request}
          setError={setError}
          setTitle={setTitle}
          title={title}
          setLoadingTodosIds={setLoadingTodosIds}
        />

        <TodoList
          todos={filterTodos}
          onDelete={deleteTodo}
          loadingTodosIds={loadingTodosIds}
          isLoaderActive={isLoaderActive}
        />
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            loadingTodosIds={loadingTodosIds}
            onDelete={deleteTodo}
            isLoaderActive={isLoaderActive}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length && (
          <TodoFooter
            todos={todos}
            isOneTodoCompleted={isOneTodoCompleted}
            filterParam={filterParam}
            setFilterParam={setFilterParam}
            deleteCompletedTodos={handleClearCompleted}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error.trim() },
        )}
      >
        <button
          aria-label="error"
          type="button"
          data-cy="HideErrorButton"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
