/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import * as todosServices from './api/todos';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoItem } from './components/TodoItem/TodoItem';

const USER_ID = 11692;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [statusResponse, setStatusResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const inputRef = useRef<HTMLInputElement>(null);

  function setError(message: string) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [statusResponse]);

  // eslint-disable-next-line no-console
  console.log(inputRef);

  useEffect(() => {
    todosServices.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  function addTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedInputValue = inputValue.trim();

    setStatusResponse(true);

    if (!trimmedInputValue) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    const data = {
      userId: USER_ID,
      title: trimmedInputValue,
      completed: false,
    };

    const newTempTodo: Todo = {
      id: 0,
      ...data,
    };

    setTempTodo(newTempTodo);
    setIsLoading(true);

    todosServices.createTodo(data)
      .then(newTodo => {
        setInputValue('');
        setTodos(currentTodos => [
          ...currentTodos,
          newTodo,
        ]);
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
        setStatusResponse(false);
      });
  }

  const deleteTodo = (todoId: number) => {
    setIsLoading(true);

    todosServices.deleteTodo(todoId)
      .then(() => setTodos(currentTodo => currentTodo
        .filter(todo => todo.id !== todoId)))
      .catch(() => setError(''))
      .finally(() => setIsLoading(false));
  };

  // eslint-disable-next-line no-console
  console.log(inputValue);

  // ///////////////////////////////
  const filteredTodos: Todo[] = useMemo(() => {
    let preparedTodos = [...todos];

    if (filter !== Filter.ALL) {
      preparedTodos = preparedTodos.filter(todo => {
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
  }, [filter, todos]);

  useEffect(() => {
    setStatusResponse(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [statusResponse]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {todos.length > 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={addTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              ref={inputRef}
              disabled={isLoading}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodo}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            deleteTodo={deleteTodo}
          />
        )}

        {/* Hide the footer if there are no todos */}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <TodoFilter
              filter={filter}
              setFilter={setFilter}
            />

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
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {/*
         Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
        */}
        {errorMessage}
      </div>
    </div>
  );
};
