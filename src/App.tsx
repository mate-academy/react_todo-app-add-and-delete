/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import TodosList from './components/TodosList';
import Footer from './components/Footer';

export enum FilterTerm {
  All = 'All',
  Completed = 'Completed',
  Active = 'Active',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempoTodo, setTempoTodo] = useState<Todo | null>(null);
  const [leftItems, setLeftItems] = useState(0);
  const [hasCompletedTodos, setHasCompletedTodos] = useState(false);

  const [todoTitle, setTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTodo, setIsLoadingTodo] = useState<number | null>(null);

  const [filterTerm, setFilterTerm] = useState('All');

  const [errorMessage, setErrorMessage] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed && todo.id),
    [todos],
  );

  const filteredTodos = useMemo(() => {
    switch (filterTerm) {
      case FilterTerm.Completed:
        return todos.filter(todo => todo.completed);
      case FilterTerm.Active:
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }, [todos, filterTerm]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  useEffect(() => {
    const activeCount = todos.reduce((acm, todo) => {
      return todo.completed ? acm : acm + 1;
    }, 0);

    setLeftItems(activeCount);
  }, [todos]);

  useEffect(() => {
    setHasCompletedTodos(completedTodos.length > 0);
  }, [completedTodos]);

  function loadTodos() {
    setIsLoading(true);
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadTodos();
  }, []);

  function addTodo({ title, userId, completed }: Todo) {
    setIsLoadingTodo(userId);
    setIsLoading(true);

    todoService
      .createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => inputRef.current?.focus(), 0);
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoadingTodo(null);
        setTempoTodo(null);

        setTimeout(() => setErrorMessage(''), 3000);
      });
  }

  function deleteTodo(todoId: number) {
    setIsLoadingTodo(todoId);
    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => setIsLoadingTodo(null));
  }

  function updateTodo(todoId: number, newStatus: boolean) {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: newStatus } : todo,
      ),
    );

    setIsLoadingTodo(todoId);

    todoService
      .updateTodo(todoId, newStatus)
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsLoadingTodo(null);
      });
  }

  function clearCompletedTodos() {
    setIsLoading(true);

    Promise.allSettled(
      completedTodos.map(todo => {
        if (todo.id) {
          deleteTodo(todo.id);
        }
      }),
    )
      .then(results => {
        if (results.some(result => result.status === 'rejected')) {
          setErrorMessage('Some todos could not be deleted');
          setTimeout(() => setErrorMessage(''), 3000);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleCloseErrorMessage() {
    setErrorMessage('');
  }

  function handlerAddTodo(event: React.FormEvent) {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    const newTodo = {
      title: todoTitle.trim(),
      userId: USER_ID,
      completed: false,
    };

    const tempoNewTodo = {
      id: 0,
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempoTodo(tempoNewTodo);

    addTodo(newTodo);
  }

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTodoTitle(event.target.value);
  }

  function handleDeleteTodo(id?: number) {
    if (id === undefined) {
      return;
    }

    deleteTodo(id);
  }

  function handleChangeStatus(todoId: number | undefined, newStatus: boolean) {
    if (!todoId) {
      return;
    }

    updateTodo(todoId, newStatus);
  }

  function handleFiltered(filter: string) {
    setFilterTerm(filter);
  }

  function handleClearCompletedTodos() {
    clearCompletedTodos();
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handlerAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              value={todoTitle}
              onChange={handleTitleChange}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isLoadingTodo !== null}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodosList
              isLoadingTodo={isLoadingTodo}
              isLoading={isLoading}
              tempoTodo={tempoTodo}
              todos={filteredTodos}
              handleChangeStatus={handleChangeStatus}
              handleDeleteTodo={handleDeleteTodo}
            />

            <Footer
              leftItems={leftItems}
              handleClearCompletedTodos={handleClearCompletedTodos}
              hasCompletedTodos={hasCompletedTodos}
              handleFiltered={handleFiltered}
              filterTerm={filterTerm}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        {errorMessage}
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleCloseErrorMessage}
        />
      </div>
    </div>
  );
};
