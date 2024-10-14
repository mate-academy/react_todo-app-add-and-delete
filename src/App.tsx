/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessages } from './types/ErrorMessages';
import { FilterStatus } from './types/FilterStatus';
import { getFilteredTodos } from './utils/helperFilter';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessages.None);
  const [filter, setFilter] = useState(FilterStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedTodosIds, setProcessedTodosIds] = useState<number[]>([]);

  const handleError = useCallback((error: ErrorMessages) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage(ErrorMessages.None);
    }, 3000);
  }, []);

  const handleCompletedStatus = useCallback((todoId: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }, []);

  const filteredTodos = useMemo(
    () => getFilteredTodos(todos, filter),
    [filter, todos],
  );

  useEffect(() => {
    setErrorMessage(ErrorMessages.None);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(ErrorMessages.Load);
      });
  }, [handleError]);

  const addTodo = useCallback((newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  }, []);

  const deleteTodo = useCallback(
    (todoId: number) => {
      setProcessedTodosIds(prevIds => [...prevIds, todoId]);

      return todoService
        .deleteTodos(todoId)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== todoId),
          );
        })
        .catch(() => handleError(ErrorMessages.Delete))
        .finally(() => setProcessedTodosIds([]));
    },
    [handleError],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onTodos={setTodos}
          onAdd={addTodo}
          onErrorMessage={setErrorMessage}
          onTempTodo={setTempTodo}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          handleCompletedStatus={handleCompletedStatus}
          onDelete={deleteTodo}
          processedTodosIds={processedTodosIds}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            filter={filter}
            onFilter={setFilter}
            onDelete={deleteTodo}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};
