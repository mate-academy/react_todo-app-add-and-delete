/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isLoading, setIsLoading] = useState(false);
  const [processings, setProcessings] = useState<number[]>([]);

  const headerRef = useRef<{ focusInput: () => void }>(null);

  const showError = (message: ErrorMessage) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const hideError = () => {
    setErrorMessage('');
  };

  useEffect(() => {
    if (!todosService.USER_ID) {
      return;
    }

    const loadTodos = async () => {
      try {
        setIsLoading(true);

        const data = await todosService.getTodos();

        setTodos(data);
      } catch {
        showError(ErrorMessage.LoadError);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  const deleteTodo = async (todoId: number) => {
    setProcessings(current => [...current, todoId]);

    try {
      await todosService.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      headerRef.current?.focusInput();
    } catch {
      showError(ErrorMessage.DeleteError);
    } finally {
      setProcessings(current => current.filter(id => id !== todoId));
    }
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  if (!todosService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          ref={headerRef}
          userId={todosService.USER_ID}
          setTodos={setTodos}
          showError={showError}
          setTempTodo={setTempTodo}
        />
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          processings={processings}
          isLoading={isLoading}
          onDelete={deleteTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            setTodos={setTodos}
            setProcessings={setProcessings}
            showError={showError}
            focusHeaderInput={() => headerRef.current?.focusInput()}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} hideError={hideError} />
    </div>
  );
};
