/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorMessage } from './utils/errors';
import { FilterType } from './utils/filter';
import { TodoNew } from './components/TodoNew';
// import { create } from 'cypress/types/lodash'; був від початку

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [processings, setProcessings] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  function loadTodos() {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load));
  }

  useEffect(loadTodos, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case FilterType.Active:
        return todo.completed === false;

      case FilterType.Completed:
        return todo.completed === true;

      case FilterType.All:
      default:
        return true;
    }
  });

  function addTodo(title: string) {
    if (!title.trim()) {
      setErrorMessage(ErrorMessage.Title);

      return;
    }

    setTempTodo({
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    });

    setIsLoading(true);

    createTodo({ title: title.trim(), userId: USER_ID })
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        setTempTodo(null);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
        setTempTodo(null);
      })
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  }

  function handleDeleteTodo(todoId: number) {
    setProcessings(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setProcessings(current => current.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  }

  function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

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

          <TodoNew
            title={newTodoTitle}
            setTitle={setNewTodoTitle}
            onAdd={addTodo}
            disabled={isLoading}
            inputRef={inputRef}
          />
        </header>
        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {/* This is a completed todo */}

              {visibleTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isProcessed={processings.includes(todo.id)}
                  onDelete={() => handleDeleteTodo(todo.id)}
                />
              ))}
              {tempTodo && <TodoItem todo={tempTodo} isProcessed={true} />}
            </section>

            <Footer
              activeCount={todos.filter(t => !t.completed).length}
              completedCount={todos.filter(t => t.completed).length}
              filter={filter}
              setFilter={setFilter}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
