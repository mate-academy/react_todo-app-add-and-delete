import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import * as todosService from './api/todos';
import { TodoForm } from './components/TodoForm/Todoform';
import { TodoList } from './components/TodoList/TodoList';
import { TodoItem } from './components/TodoItem/TodoItem';
import { TodosFilter } from './components/TodoFilter/Todofilter';

const USER_ID = 11712;

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.ALL);
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

  const filteredTodos: Todo[] = useMemo(() => {
    let preparedTodos = [...todos];

    if (filter !== Filter.ALL) {
      preparedTodos = preparedTodos.filter((todo) => {
        switch (filter) {
          case Filter.ACTIVE:
            return !todo.completed;

          case Filter.COMPLETED:
            return todo.completed;

          default:
            return true;
        }
      });
    }

    return preparedTodos;
  }, [todos, filter]);

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

  const activeTodos = todos.filter((todo) => !todo.completed).length;
  const completedTodos = todos.filter((todo) => todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {activeTodos > 0 && (
            <button
              aria-label="button"
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
            <TodoList deleteTodo={deleteTodo} todos={filteredTodos} />

            {tempTodo && <TodoItem onDelete={deleteTodo} todo={tempTodo} />}

            {todos.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {`${activeTodos} items left`}
                </span>

                {/* Active filter should have a 'selected' class */}
                <TodosFilter filter={filter} setFilter={setFilter} />

                {/* don't show this button if there are no completed todos */}
                {completedTodos > 0 && (
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

        {/* Hide the footer if there are no todos */}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          aria-label="button"
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
