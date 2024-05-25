/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { FormEvent, useEffect, useRef, useState } from 'react';

import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { Statuses } from './types/Statuses';

import { UserWarning } from './components/UserWarning';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';

import { USER_ID, addTodo, deleteTodo, getTodos } from './api/todos';
import { getFilteredTodos } from './utils/getFilteredTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | ''>('');
  const [status, setStatus] = useState<Statuses>(Statuses.All);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredTodos = getFilteredTodos(todos, { status });

  const isAllTodosCompleted = todos.every(todo => todo.completed);
  const isAnyTodosCompleted = todos.some(todo => todo.completed);
  const notCompletedTodosCount = todos.reduce(
    (acc, { completed }) => acc + (completed ? 0 : 1),
    0,
  );

  // Loading Todos
  useEffect(() => {
    inputRef.current?.focus();
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.LoadTodo));
  }, []);

  // Handle ErrorMessage
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeout = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [errorMessage]);

  // Handle add new todo
  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();

    // ---validate title
    if (!title) {
      setErrorMessage(Errors.EmptyTodoTitle);

      return;
    }

    // ---disabling input while request
    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    // ---post new todo
    const newTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    // ---temporary todo
    setTempTodo({
      id: 0,
      ...newTodo,
    });

    // ---handling loader
    setLoadingTodos(current => [...current, 0]);

    // ---adding todo
    addTodo(newTodo)
      .then(newTodoFromServer => {
        setTodos(currentTodos => [...currentTodos, newTodoFromServer]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(Errors.AddTodo);
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
        setLoadingTodos(current => current.filter(todoId => todoId !== 0));
      });
  };

  // Handle delete todo
  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodos(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setErrorMessage(Errors.DeleteTodo))
      .finally(() => {
        setLoadingTodos(current =>
          current.filter(delTodoId => delTodoId !== todoId),
        );

        inputRef.current?.focus();
      });
  };

  // Handle delete all completed todos
  const handleDeleteAllCompletedTodos = async () => {
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    const requests = completedTodosId.map(todoId => deleteTodo(todoId));

    setLoadingTodos(current => [...current, ...completedTodosId]);

    try {
      const results = await Promise.allSettled(requests);

      const successfulDeletes = results
        .map((result, index) =>
          result.status === 'fulfilled' ? completedTodosId[index] : null,
        )
        .filter(Boolean);

      if (successfulDeletes.length < completedTodosId.length) {
        setErrorMessage(Errors.DeleteTodo);
      }

      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulDeletes.includes(todo.id)),
      );
    } finally {
      setLoadingTodos(current =>
        current.filter(todoId => !completedTodosId.includes(todoId)),
      );
      inputRef.current?.focus();
    }
  };

  // Handle no authorization or missing USER_ID
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {!!filteredTodos.length && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: isAllTodosCompleted,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              value={title}
              onChange={event => setTitle(event.target.value.trimStart())}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
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

        {!!todos.length && (
          <Footer
            status={status}
            setStatus={setStatus}
            notCompletedTodosCount={notCompletedTodosCount}
            isAnyTodosCompleted={isAnyTodosCompleted}
            onDeleteCompleted={handleDeleteAllCompletedTodos}
          />
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
