/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { debounce } from 'lodash';

import { AuthContext } from './components/Auth/AuthContext';
import { DefaultContext } from './components/components/DefaultContext';
import { ErrorContext }
  from './components/components/ErrorNotification/ErrorContext';

import { TodoList } from './components/components/TodoList';
import { Filter } from './components/components/Filter';
import { ErrorNotification } from './components/components/ErrorNotification';

import { getTodos, postTodo } from './api/todos';

import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Errors } from './types/Errors';

export const App: React.FC = React.memo(
  () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = useContext(AuthContext);
    const newTodoField = useRef<HTMLInputElement>(null);

    const [status, setStatus] = useState(Status.ALL);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [appliedNewTodoTitle, setAppliedNewTodoTitle] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const {
      todosFromServer,
      setTodosFromServer,
      clearCompletedTodos,
    } = useContext(DefaultContext);

    const { setError } = useContext(ErrorContext);

    const loadTodos = async () => {
      if (user) {
        try {
          setError(Errors.NONE);
          const todos = await getTodos(user.id);

          setTodosFromServer(todos);
        } catch {
          setError(Errors.LOAD);
        }
      }
    };

    const createTodo = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (user && newTodoTitle) {
        try {
          setIsAdding(true);
          const todo = await postTodo(user.id, newTodoTitle) as Todo;

          setTodosFromServer([...todosFromServer, todo]);
        } catch {
          setError(Errors.ADD);
        } finally {
          setIsAdding(false);
          setNewTodoTitle('');
        }
      } else {
        setError(Errors.ADD);
      }
    };

    useEffect(() => {
      loadTodos();
    }, [user]);

    useEffect(() => {
      if (newTodoField.current) {
        newTodoField.current.focus();
      }
    }, [todosFromServer]);

    const todos = useMemo(() => (
      todosFromServer.filter(todo => {
        switch (status) {
          case Status.COMPLETED:
            return todo.completed;

          case Status.ACTIVE:
            return !todo.completed;
          default:
            return todo;
        }
      })
    ), [todosFromServer, status]);

    const activeTodosCount = todosFromServer.reduce(
      (acc, todo) => (!todo.completed ? 1 : 0) + acc, 0,
    );

    const applyNewTodoTitle = useCallback(
      debounce(setAppliedNewTodoTitle, 1000),
      [],
    );

    return (
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            <button
              data-cy="ToggleAllButton"
              type="button"
              className="todoapp__toggle-all active"
            />

            <form onSubmit={createTodo}>
              <input
                data-cy="NewTodoField"
                type="text"
                ref={newTodoField}
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                value={newTodoTitle}
                disabled={isAdding}
                onChange={e => {
                  setNewTodoTitle(e.target.value);
                  applyNewTodoTitle(e.target.value);
                }}
              />
            </form>
          </header>

          <TodoList
            todos={todos}
            isAdding={isAdding}
            newTodoTitle={appliedNewTodoTitle}
          />

          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${activeTodosCount} items left`}
            </span>

            <Filter
              status={status}
              setStatus={setStatus}
            />

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              onClick={clearCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        </div>

        <ErrorNotification />
      </div>
    );
  },
);
