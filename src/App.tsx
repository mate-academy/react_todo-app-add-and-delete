/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { errors } from './constans/Errors';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Status } from './types/Status';
import * as todoServise from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<Status>(Status.All);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  const removeTempTodo = () => {
    setTempTodo(null);
  };

  useEffect(() => {
    getTodos()
      .then(todosData => {
        setTodos(todosData);
      })
      .catch(() => {
        showError(errors.load);
      });
  }, []);

  function addTodo({ title, userId, completed }: Omit<Todo, 'id'>) {
    setError('');
    setIsSubmitting(true);

    const newTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      userId: todoServise.USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });
    setLoadingTodos(prevLoadingTodos => [...prevLoadingTodos, 0]);

    return todoServise
      .createTodos({ title, userId, completed })
      .then(newTodos => {
        setTodos(currentTodo => [...currentTodo, newTodos]);
        setTempTodo(null);
      })
      .catch(catchError => {
        removeTempTodo();
        showError(errors.add);
        throw catchError;
      })
      .finally(() => {
        setIsSubmitting(false);
        setLoadingTodos(prevLoadingTodos =>
          prevLoadingTodos.filter(todoId => todoId !== 0),
        );
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setError={setError}
          onSubmit={addTodo}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          inputRef={inputRef}
          loadingTodos={loadingTodos}
          setLoadingTodos={setLoadingTodos}
        />

        {todos.length !== 0 && (
          <TodoList
            todos={todos}
            setTodos={setTodos}
            selectedFilter={selectedFilter}
            setError={setError}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            tempTodo={tempTodo}
            loadingTodos={loadingTodos}
          />
        )}

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
          disabled={isSubmitting}
        />
        {error}
      </div>
    </div>
  );
};
