/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
// import { addTodo, deleteTodo, getTodos } from './api/todos';
import { ErrorType } from './types/ErrorType';
import { StatusFilter } from './types/StatusFilter';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoItem } from './components/TodoItem';
import * as todoService from './api/todos';

const USER_ID = 11465;

const getFilterTodos = (
  todos: Todo[],
  statusFilter: StatusFilter,
): Todo[] => {
  let filteredTodos: Todo[] = [];

  switch (statusFilter) {
    case StatusFilter.All: {
      filteredTodos = todos;
      break;
    }

    case StatusFilter.Active: {
      filteredTodos = todos.filter(todo => todo.completed === false);

      break;
    }

    case StatusFilter.Completed: {
      filteredTodos = todos.filter(todo => todo.completed === true);

      break;
    }

    default: filteredTodos = todos;
  }

  return filteredTodos;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoadig, setIsLoading] = useState(false);
  const [status, setStatus] = useState<StatusFilter>(StatusFilter.All);
  const [todoError, setTodoError] = useState<ErrorType | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [todoIdToDelete, setTodoIdToDelete] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsLoading(true);

    todoService.getTodos(USER_ID)
      .then(todoFromServer => {
        setTodos(todoFromServer);
        setIsLoading(false);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.warn(error);
        setTodoError(ErrorType.GetData);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTodoError(null);
    }, 3000);

    return () => clearTimeout(timeoutId);
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, tempTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = getFilterTodos(todos, status);
  const countActiveTodos = todos
    .filter(todo => todo.completed === false)
    .length;
  const countCompletedTodos = todos
    .filter(todo => todo.completed === true)
    .length;

  const handleStatusChange = (filteredKey: StatusFilter) => {
    setStatus(filteredKey);
  };

  const showError = (error: ErrorType) => {
    setTodoError(error);

    setTimeout(() => {
      setTodoError(null);
    }, 3000);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTodoTitle.trim()) {
      showError(ErrorType.Title);
    } else {
      const newTodo = {
        title: newTodoTitle.trim(),
        userId: USER_ID,
        completed: false,
      };

      todoService.addTodo(newTodo)
        .then((createdTodo) => {
          setTodos((prevState) => [...prevState, createdTodo]);
          setNewTodoTitle('');
        })
        .catch(() => {
          showError(ErrorType.Add);
        })
        .finally(() => {
          setIsRequesting(false);
          setTempTodo(null);
        });

      setIsRequesting(true);
      const temp: Todo = Object.assign(newTodo, { id: 0 });

      setTempTodo(temp);
    }
  };

  const handleDelete = (todoId: number) => {
    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos((prevState) => {
          return prevState.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        showError(ErrorType.Delete);
        setTodoIdToDelete(0);
      });
    setTodoIdToDelete(todoId);
  };

  const handleClearCompleted = () => {
    const allCompletedTodos = todos.filter(todo => todo.completed);

    allCompletedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  };

  const handleChangeTodoTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTodoTitle(event.target.value);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {!!todos.length && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all',
                { active: !countActiveTodos })}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              value={newTodoTitle}
              onChange={handleChangeTodoTitle}
              disabled={isRequesting}
            />
          </form>
        </header>
        {!isLoadig && (
          <>
            <TodoList
              todos={visibleTodos}
              handleDelete={handleDelete}
              todoIdToDelete={todoIdToDelete}
            />
            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                isActive={isRequesting}
                handleDelete={handleDelete}
              />
            )}
            {!!todos.length && (
              <TodoFilter
                status={status}
                handleStatusChange={handleStatusChange}
                countActiveTodos={countActiveTodos}
                countCompletedTodos={countCompletedTodos}
                handleClearCompleted={handleClearCompleted}
              />
            )}

          </>
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
          { hidden: !todoError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setTodoError(null)}
        />
        {todoError}
      </div>
    </div>
  );
};
