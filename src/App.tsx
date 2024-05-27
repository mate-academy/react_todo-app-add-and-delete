/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { USER_ID, createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import cn from 'classnames';
import { TodoItem } from './components/TodoItem';

type Status = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<Status>('all');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    getTodos()
      .then(response => setTodos(response))
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeout = setTimeout(() => setErrorMessage(''), 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [errorMessage]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  let filterTodos = todos;

  if (status === 'active') {
    filterTodos = activeTodos;
  }

  if (status === 'completed') {
    filterTodos = completedTodos;
  }

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    setLoadingTodos(current => [...current, 0]);

    createTodo(newTodo)
      .then(newTodoFromServer => {
        setTodos(currentTodos => [...currentTodos, newTodoFromServer]);
        setTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
        setLoadingTodos(current => current.filter(todoId => todoId !== 0));
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodos(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setLoadingTodos(current =>
          current.filter(delitingTodoId => todoId !== delitingTodoId),
        );
      });
  };

  const handleDeleteAllCompleted = () => {
    const completedTodosIds = completedTodos.map(todo => todo.id);

    const requests: Promise<unknown>[] = [];

    completedTodosIds.forEach(todoId => requests.push(deleteTodo(todoId)));

    setLoadingTodos(current => [...current, ...completedTodosIds]);

    Promise.all(requests)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => !completedTodosIds.includes(todo.id)),
        );
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setLoadingTodos(current =>
          current.filter(todoId => !completedTodosIds.includes(todoId)),
        );
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={event => handleAddTodo(event)}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value.trimStart())}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filterTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDelete={handleDeleteTodo}
                  isLoading={loadingTodos.includes(todo.id)}
                />
              ))}

              {tempTodo && (
                <TodoItem
                  todo={tempTodo}
                  onDelete={() => {}}
                  isLoading={loadingTodos.includes(0)}
                />
              )}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeTodos.length} items left
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={cn('filter__link', { selected: status === 'all' })}
                  data-cy="FilterLinkAll"
                  onClick={() => setStatus('all')}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={cn('filter__link', {
                    selected: status === 'active',
                  })}
                  data-cy="FilterLinkActive"
                  onClick={() => setStatus('active')}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={cn('filter__link', {
                    selected: status === 'completed',
                  })}
                  data-cy="FilterLinkCompleted"
                  onClick={() => setStatus('completed')}
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={handleDeleteAllCompleted}
                disabled={completedTodos.length === 0}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

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
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
