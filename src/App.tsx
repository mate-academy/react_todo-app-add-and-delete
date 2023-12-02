/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoFilter } from './components/TodoFilter';
import { Filter } from './types/Filter';

const USER_ID = 11959;
const ALL = 'all';
const ACTIVE = 'active';
const COMPLETED = 'completed';

export const App: React.FC = () => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(ALL);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const isSomeComplete = todos.some(todo => todo.completed);
  const isSomeActive = todos.some(todo => !todo.completed);
  const isDuplicate = todos.some(todo => todo.title === title);

  const formFocus = useCallback((inputElement: HTMLInputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempTodo]);

  const handleSetError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(todosList => todosList.filter(todo => {
        switch (filter) {
          case ACTIVE:
            return !todo.completed;

          case COMPLETED:
            return todo.completed;

          default:
            return todo;
        }
      }))
      .then(setTodos)
      .catch(() => handleSetError('Unable to load todos'));
  }, [filter]);

  const handleSetTodo = () => {
    if (title.trim()) {
      if (!isDuplicate) {
        setIsInputDisabled(true);

        setTempTodo({
          id: 0,
          userId: USER_ID,
          title: title.trim(),
          completed: false,
        });

        const maxId = Math.max(0, ...todos.map(todo => todo.id));
        const newTodo = {
          id: maxId + 1,
          userId: USER_ID,
          title: title.trim(),
          completed: false,
        };

        todoService.createTodo(newTodo)
          .then(createdTodo => {
            setTodos((oldTodos) => [...oldTodos, createdTodo]);
            setTitle('');
          })
          .catch(() => {
            handleSetError('Unable to add a todo');
          })
          .finally(() => {
            setIsInputDisabled(false);
            setTempTodo(null);
          });
      } else {
        handleSetError('This TODO already exists');
      }
    }
  };

  const handleSetTodoOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSetTodo();

    if (!title.trim()) {
      handleSetError('Title should not be empty');
    }
  };

  const handleSetTodoOnBlur = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSetTodo();
  };

  const deleteTodo = (todoId: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

    todoService.deleteTodo(todoId)
      .catch((err) => {
        setTodos(todos);
        handleSetError('Unable to delete a todo');
        throw err;
      });
  };

  const clearComplete = () => {
    todos.map(todo => todo.completed && deleteTodo(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {isSomeActive && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          <form
            onSubmit={handleSetTodoOnSubmit}
            onBlur={handleSetTodoOnBlur}
          >
            <input
              ref={formFocus}
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isInputDisabled}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <TodoList
          todos={todos}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todos.filter(todo => !todo.completed).length} items left`}
            </span>

            <TodoFilter
              filter={filter}
              setFilter={setFilter}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={clearComplete}
            >
              {isSomeComplete && 'Clear completed'}
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal', {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
