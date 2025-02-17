/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { ErrorMessage } from './types/ErrorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [typeFilter, setTypeFilter] = useState<FilterType>(FilterType.ALL);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.NoError,
  );
  const [titleInput, setTitleInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToLoad);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setErrorMessage(ErrorMessage.NoError), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  function createTodoService(title: string) {
    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    setIsLoading(true);

    createTodo({ title: trimmedTitle, userId: USER_ID, completed: false })
      .then((newTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitleInput('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToAdd);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  }

  function deleteTodoService(todoId: number) {
    setIsLoading(true);
    setDeletingTodoId(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage(ErrorMessage.UnableToDelete))
      .finally(() => {
        setIsLoading(false);
        setDeletingTodoId(null);
      });
  }

  const filteredTodos = useMemo(() => {
    const filtered = [...todos];

    switch (typeFilter) {
      case FilterType.ACTIVE:
        return filtered.filter(todo => !todo.completed);
      case FilterType.COMPLETED:
        return filtered.filter(todo => todo.completed);
      case FilterType.ALL:
        return filtered;
    }

    return filtered;
  }, [todos, typeFilter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          titleInput={titleInput}
          setTitleInput={setTitleInput}
          createTodoService={createTodoService}
          isLoading={isLoading}
        />

        <Main
          filteredTodos={filteredTodos}
          deleteTodoService={deleteTodoService}
          isLoading={isLoading}
          tempTodo={tempTodo}
          deletingTodoId={deletingTodoId}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            isAllActive={todos.every(todo => !todo.completed)}
            deleteTodoService={deleteTodoService}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
