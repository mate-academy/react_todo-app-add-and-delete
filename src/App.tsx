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

const USER_ID = 11467;

export const App: React.FC = () => {
  const [filterParam, setFilterParam] = useState(FilterParam.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [request, setRequest] = useState(true);
  const [title, setTitle] = useState('');

  // if (!USER_ID) {
  //   return <UserWarning />;
  // }

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
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        setRequest(false);
      });
  };

  const deleteTodo = useCallback((id: number) => {
    todoService
      .deleteUserTodo(id)
      .then(() => {
        setTodos((prevState) => (
          prevState.filter(todo => todo.id !== id)
        ));
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

  const isOneTodoCompleted = useMemo(() => todos
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
        />

        <TodoList
          todos={filterTodos}
          onDelete={deleteTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length && (
          <TodoFooter
            todos={todos}
            isOneTodoCompleted={isOneTodoCompleted}
            filterParam={filterParam}
            setFilterParam={setFilterParam}
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
