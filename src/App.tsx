import React, { useEffect, useState } from 'react';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Footer } from './components/Footer/Footer';
import { ErrorHandler } from './components/ErrorHandler/ErrorHandler';

import { USER_ID, createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { SortFields } from './types/sortFields';
import { ErrorTypes } from './types/errorTypes';

import { getVisibleTodos } from './utils/getVisibleTodos';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<ErrorTypes | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedField, setSelectedField] = useState(SortFields.default);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorTypes.UnableToLoad);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function onAddTodo({
    title,
    userId,
    completed,
  }: Omit<Todo, 'id'>): Promise<void> {
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!title) {
      setErrorMessage(ErrorTypes.invalidTitle);
      setIsSubmitting(false);

      return Promise.resolve();
    }

    setTempTodo({
      id: 0,
      title: title,
      userId: userId,
      completed: completed,
    });

    return createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage(ErrorTypes.UnableToAdd);
        throw error;
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  }

  function onDeleteTodo(todoId: number): Promise<void> {
    setIsSubmitting(true);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        setErrorMessage(ErrorTypes.UnableToDelete);
        throw error;
      })
      .finally(() => setIsSubmitting(false));
  }

  const visibleTodos = getVisibleTodos(todos, selectedField);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header addTodo={onAddTodo} isSubmiting={isSubmitting} />

        <Main
          todos={visibleTodos}
          deleteTodo={onDeleteTodo}
          setTodos={setTodos}
          loadingIds={loadingIds}
          setLoadingIds={setLoadingIds}
        />

        {tempTodo !== null && (
          <TodoItem todo={tempTodo} isSubmiting={isSubmitting} />
        )}

        {todos.length > 0 && (
          <Footer
            selectedField={selectedField}
            setSelectedField={setSelectedField}
            todos={todos}
            deleteTodo={onDeleteTodo}
            setLoadingIds={setLoadingIds}
          />
        )}
      </div>

      <ErrorHandler
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
