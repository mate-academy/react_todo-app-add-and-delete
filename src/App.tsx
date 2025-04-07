/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer'; // Import the new Footer component
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { filter, FilterType } from './utils/filter';
import { getTodos, postTodo, deleteTodo } from './api/todos';
import { Form } from './components/Form';
import { TodoCard } from './components/TodoCard';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [shownTodos, setShownTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>();
  const [processedIDs, setProcessedIDs] = useState<number[]>([]);

  const loadTodos = () => {
    getTodos()
      .then(todos => setTodosFromServer(todos))
      .catch(() => setErrorMessage('Unable to load todos'));
  };

  const errorTimeout = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusField = () => {
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  useEffect(() => focusField(), [shownTodos]);
  useEffect(() => {
    loadTodos();
    focusField();
  }, []);

  useEffect(
    () => setShownTodos(filter(todosFromServer, filterType)),
    [todosFromServer, filterType],
  );

  useEffect(() => {
    window.clearTimeout(errorTimeout.current);
    errorTimeout.current = 0;
    if (errorMessage) {
      errorTimeout.current = window.setTimeout(
        () => setErrorMessage(null),
        3000,
      );
    }
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (title: string): Promise<boolean> => {
    if (!title.trim()) {
      setErrorMessage('Title should not be empty');
      focusField();

      return Promise.resolve(false);
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });

    return postTodo({ userId: USER_ID, title: title.trim(), completed: false })
      .then(todo => {
        setTodosFromServer(prev => [...prev, todo]);

        return true;
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        focusField();

        return false;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteTodoWrapper = (id: number) => {
    return deleteTodo(id)
      .then(() => {
        setTodosFromServer(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  };

  const bulkDelete = (todos: Todo[]) => {
    setProcessedIDs(todos.map(todo => todo.id));
    Promise.allSettled(todos.map(todo => deleteTodo(todo.id)))
      .then(results => {
        const successedResults = results
          .map((result, index) =>
            result.status === 'fulfilled' ? todos[index] : null,
          )
          .filter(it => {
            if (it === null) {
              setErrorMessage('Unable to delete a todo');
            }

            return it !== null;
          });

        setTodosFromServer(prev =>
          prev.filter(todo => !successedResults.includes(todo)),
        );
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        focusField();
        setProcessedIDs([]);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={`todoapp__toggle-all ${shownTodos.every(todo => todo.completed) && 'active'}`}
            data-cy="ToggleAllButton"
            title="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <Form onSubmit={addTodo} inputRef={inputRef} />
        </header>

        <TodoList
          todos={shownTodos}
          onDelete={deleteTodoWrapper}
          inProcess={processedIDs}
        />
        {tempTodo && (
          <TodoCard
            todo={tempTodo}
            isDefaultLoading={true}
            onDelete={() => new Promise(() => {})}
          />
        )}
        {/* Use the extracted Footer component */}
        {/* Hide the footer if there are no todos */}
        {todosFromServer.length !== 0 && (
          <Footer
            shownTodos={shownTodos}
            filterType={filterType}
            setFilterType={setFilterType}
            counter={todosFromServer.filter(todo => !todo.completed).length}
            bulkDelete={bulkDelete}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!!!errorMessage && 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          title="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
