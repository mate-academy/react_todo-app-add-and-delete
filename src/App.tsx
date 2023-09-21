/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { FilterTodos } from './types/FilterTodos';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Error } from './types/Error';

// my ID = 11480

const USER_ID = 11480;

const filterTodos = (todos: Todo[], filterStatus: FilterTodos): Todo[] => {
  return todos.filter((todo: Todo) => {
    switch (filterStatus) {
      case FilterTodos.Completed:
        return todo.completed;
      case FilterTodos.Active:
        return !todo.completed;
      default:
        return 1;
    }
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosFilterStatus, setTodosFilterStatus] = useState(FilterTodos.All);
  const [todosError, setTodosError] = useState('');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const visibleTodos = filterTodos(todos, todosFilterStatus);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTodosError('');
    }, 3000);

    getTodos(USER_ID)
      .then(setTodos)
      .catch((error) => {
        setTodosError(Error.DOWNLOAD_ERROR_MESSAGE);
        throw error;
      });

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isLoading]);

  // const completedTodos = visibleTodos
  //   .filter(({ completed }) => completed);

  const handleFilterStatus = (status: FilterTodos) => (
    setTodosFilterStatus(status));

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodoHandler = (newTodo: Omit<Todo, 'id'>) => {
    addTodo(newTodo)
      .then(createdTodo => {
        setTodos(
          (prevTodos: Todo[]) => [...prevTodos, createdTodo],
        );
        setQuery('');
        setTempTodo(null);
      })
      .then(() => setIsLoading(false))
      .catch(error => {
        setTodosError(Error.ADD_ERROR_MESSAGE);
        throw error;
      });
  };

  const deleteTodoHandler = (todoId: number) => {
    deleteTodo(todoId).then(() => {
      setTodos((prevTodos) => prevTodos.filter(({ id }) => id !== todoId));
    })
      .catch((error) => {
        setTodosError(Error.DELETE_ERROR_MESSAGE);
        throw error;
      });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    };

    if (query.trim() === '') {
      setTodosError('Title should not be empty');
    }

    if (query.trim() !== '') {
      addTodoHandler(newTodo);
    }

    setIsLoading(true);
    setTempTodo(newTodo);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}

          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          {visibleTodos.length !== 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={onSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              ref={newTodoField}
              disabled={isLoading}
            />
          </form>
        </header>
        <TodoList
          todos={visibleTodos}
          deleteTodoHandler={deleteTodoHandler}
          tempTodo={tempTodo}
        />
        {Boolean(visibleTodos.length) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              2 items left
              {/* {`${visibleTodos.length
                && (visibleTodos.length - completedTodos.length)}
                 items left`} */}
            </span>

            <TodoFilter
              handleFilterStatus={handleFilterStatus}
              todosFilterStatus={todosFilterStatus}
            />
            {/* Active filter should have a 'selected' class */}
            {/* don't show this button if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>

          </footer>
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
          {
            hidden: !todosError,
          },
        )}
      >
        <button
          type="button"
          data-cy="HideErrorButton"
          className="delete"
          onClick={() => setTodosError('')}
        />
        {todosError}
      </div>
    </div>
  );
};
