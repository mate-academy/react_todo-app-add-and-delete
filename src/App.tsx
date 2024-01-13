/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import * as clientService from './api/todos';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { FilterOptions } from './types/FilterOptions';

const USER_ID = 12166;
const getFilteredTodos = (todos: Todo[], filterBy: FilterOptions) => {
  switch (filterBy) {
    case FilterOptions.All:
      return todos;
    case FilterOptions.Active:
      return todos.filter(todo => !todo.completed);
    case FilterOptions.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterOptions.All);
  const filteredTodos = getFilteredTodos(todos, filterBy);
  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const [temporartTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [TodoTitle, setTodoTitle] = useState('');
  const [errorMasage, setErrorMasage] = useState(Errors.allGood);
  const titleField = useRef<HTMLInputElement>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const reset = () => {
    setTodoTitle('');
    setErrorMasage(Errors.allGood);
    setTemporaryTodo(null);
    setIsDisabled(false);
  };

  function loadTodos() {
    clientService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMasage(Errors.cantGetArray));
  }

  const addTodo = (
    title: string, userId: number, completed: boolean,
  ) => {
    setIsDisabled(true);
    setTemporaryTodo({
      title, userId, completed: false, id: 0,
    });
    clientService.addTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodo];
        });
      })
      .catch((error) => {
        setErrorMasage(Errors.cantAdd);
        setTemporaryTodo(null);
        setIsDisabled(false);
        throw error;
      })
      .then(() => {
        reset();
      });
  };

  const deleteTodo = (id: number) => {
    return clientService.deleteTodo(id)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) => {
        setErrorMasage(Errors.cantDelete);
        throw error;
      });
  };

  const onClearCompleted = () => {
    todos.filter(todo => todo.completed).map(todo => (
      deleteTodo(todo.id)
        .catch((error) => {
          throw error;
        })
        .then(() => {
          setTodos(uncompletedTodos);
        })
    ));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadTodos, [USER_ID]);
  // Error will hide after 3s
  useEffect(() => {
    titleField.current?.focus();
    const timerId = window.setTimeout(() => {
      setErrorMasage(Errors.allGood);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMasage, todos]);

  const handelErrorHide = () => {
    setErrorMasage(Errors.allGood);
  };

  const handelTitelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!TodoTitle.trim()) {
      setErrorMasage(Errors.cantBeEmptyTitle);

      return;
    }

    setErrorMasage(Errors.allGood);
    addTodo(TodoTitle.trim(), USER_ID, false);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handelSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isDisabled}
              ref={titleField}
              value={TodoTitle}
              onChange={handelTitelChange}
            />
          </form>
        </header>

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              deleteTodo={deleteTodo}
              temporaryTodo={temporartTodo}
            />
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {`${uncompletedTodos.length} items left`}
              </span>

              <TodoFilter changeFilter={setFilterBy} />

              {uncompletedTodos.length && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  onClick={onClearCompleted}
                >
                  Clear completed
                </button>
              )}

            </footer>
          </>
        )}

      </div>

      <div
        data-cy="ErrorNotification"
        className={
          classNames('notification is-danger is-light has-text-weight-normal',
            !errorMasage && 'hidden')
        }
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handelErrorHide}
        />
        {errorMasage}
      </div>

    </div>
  );
};
