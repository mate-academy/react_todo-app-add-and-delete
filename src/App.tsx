/* eslint-disable no-lone-blocks */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useMemo, useState, useRef,
} from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import * as fetchCl from './api/todos';
import { Header } from './components/header/Header';
import { Todoapp } from './components/Todoapp/Todoapp';
import { Todo } from './types/Todo';

const USER_ID = 11999;

enum Status {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoNameInput, setTodoNameInput] = useState('');
  const [status, setStatus] = useState<Status>(Status.all);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unActive, setUnActive] = useState<number | null>(null);

  const todoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCl.getTodos(USER_ID)
      .then(res => {
        setTodos(res);
      })
      .catch(() => setError('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!loading) {
      todoInputRef.current?.focus();
    }
  }, [loading]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (status === Status.active) {
        return !todo.completed;
      }

      if (status === Status.completed) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, status]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (todoNameInput.trim()) {
      setLoading(true);

      const tempTodo = {
        id: 0,
        userId: USER_ID,
        title: todoNameInput.trim(),
        completed: false,
      };

      const arrTodosWithTemp = [...todos, tempTodo];

      setTodos(arrTodosWithTemp);
      setUnActive(0);

      fetchCl.createTodo(tempTodo)
        .then(res => {
          setTodos([...todos, res]);
          setTodoNameInput('');
        }).catch(() => {
          setTodos([...todos]);
          setError('Unable to add todo');
          setTimeout(() => setError(''), 3000);
        }).finally(() => {
          setLoading(false);
        });
    } else {
      setError('Title should not be empty');
      setTimeout(() => setError(''), 3000);
    }
  };

  const deleteTodo = (todoId: number) => {
    setLoading(true);
    setUnActive(todoId);

    fetchCl.deleteTodo(todoId)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError('Unable to delete todo');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const countRemainingTodo = () => {
    let count = 0;

    todos.filter(todo => todo.id !== 0).forEach(todo => {
      if (!todo.completed) {
        count += 1;
      }
    });

    return count;
  };

  const countActiveTodo = countRemainingTodo();
  const hasCompletedTodo = visibleTodos.some(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={addTodo}
          inputValue={todoNameInput}
          changeInputValue={setTodoNameInput}
          isLoading={loading}
          todoInputRef={todoInputRef}
        />

        {todos
          && (
            <Todoapp
              todos={visibleTodos}
              deleteTodoAction={deleteTodo}
              unActive={unActive}
            />
          )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${countActiveTodo} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: status === Status.all,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setStatus(Status.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: status === Status.active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setStatus(Status.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: status === Status.completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setStatus(Status.completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              {hasCompletedTodo
                ? 'Clear completed'
                : ''}
            </button>
          </footer>
        )}
      </div>
      {error && (
        <div
          data-cy="ErrorNotification"
          className={cn(
            'notification',
            'is-danger',
            'is-light',
            'has-text-weight-normal',
            { hidden: !error },
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
      )}
    </div>
  );
};
