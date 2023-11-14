/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import cn from 'classnames';

import { Todo } from './types/Todo';
import { Status } from './types/Status';
import * as todosService from './api/todos';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/TodoList/TodoList';
import { TodoItem } from './components/TodoItem/TodoItem';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { UserWarning } from './UserWarning';

const USER_ID = 11604;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<Status>(Status.All);
  const [title, setTitle] = useState('');
  const [statusResponse, setStatusResponse] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  function setError(message: string) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    setIsLoading(true);

    todosService
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredTodos = (todosFilter: Todo[], filterStatus: Status): Todo[] => {
    return todosFilter.filter(currentTodo => {
      switch (filterStatus) {
        case Status.Active:
          return !currentTodo.completed;
        case Status.Completed:
          return currentTodo.completed;
        default:
          return true;
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const deleteTodo = (todoId: number) => {
    setTodos((currentTodos) => currentTodos
      .filter((todo) => todo.id !== todoId));

    todosService.deleteTodo(todoId).catch(() => {
      setTodos(todos);
      setError('Unable to delete a todo');
    });
  };

  function addTodo() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    const data = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...data,
    });

    setStatusResponse(true);

    todosService
      .createTodo(data)
      .then((newTodo) => {
        setTitle('');
        setTodos((currentTodos) => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setStatusResponse(false);
      });
  }

  const visibleTodos = filteredTodos(todos, status);
  const handleFilterStatus = (todosStatus: Status) => (
    setStatus(todosStatus));

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {activeTodosCount > 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <TodoForm
            title={title}
            setTitle={(value) => setTitle(value)}
            onSubmit={() => addTodo()}
            statusResponse={statusResponse}
          />
        </header>

        {!isLoading && (
          <>
            <TodoList todos={visibleTodos} deleteTodo={deleteTodo} />

            {tempTodo && <TodoItem onDelete={deleteTodo} todo={tempTodo} />}

            {!!todos?.length && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {`${activeTodosCount} items left`}
                </span>

                <TodoFilter
                  handleFilterStatus={handleFilterStatus}
                  todosFilterStatus={status}
                />

                {completedTodosCount > 0 && (
                  <button
                    type="button"
                    className="todoapp__clear-completed"
                    data-cy="ClearCompletedButton"
                  >
                    Clear completed
                  </button>
                )}
              </footer>
            )}
          </>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
