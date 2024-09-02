/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Filters } from './components/Filters/Filters';
import { TodoError } from './components/TodoError/TodoError';
import { ErrorMessages } from './types/Error';
import { filterTodos } from './utils/Helpers';

type ErrorMessageSetter = React.Dispatch<React.SetStateAction<string | null>>;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState(Filters.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedId, setProcessedId] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleError = useCallback((error: ErrorMessages) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }, []);

  const setErrorMessageWrapper: ErrorMessageSetter = useCallback(
    error => {
      if (typeof error === 'function') {
        const currentError = error(errorMessage);

        handleError(currentError as ErrorMessages);
      } else {
        handleError(error as ErrorMessages);
      }
    },
    [handleError, errorMessage],
  );

  useEffect(() => {
    if (!todosService.USER_ID) {
      return;
    }

    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => handleError(ErrorMessages.UNABLE_TO_LOAD));
  }, [handleError]);

  const handleCompletedStatus = useCallback((id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }, []);

  const addTodo = useCallback((todo: Todo) => {
    setTodos(prevTodos => [...prevTodos, todo]);
  }, []);

  const deleteTodo = useCallback(
    (id: number) => {
      setProcessedId(ids => [...ids, id]);

      return todosService
        .deleteTodos(id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
        })
        .catch(() => handleError(ErrorMessages.UNABLE_TO_DELETE))
        .finally(() => setProcessedId([]));
    },
    [handleError],
  );

  const filteredTodos = useMemo(
    () => filterTodos(todos, currentFilter),
    [todos, currentFilter],
  );

  if (!todosService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onAdd={addTodo}
          setErrorMessage={setErrorMessageWrapper}
          setTempTodo={setTempTodo}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          handleCompletedStatus={handleCompletedStatus}
          onDelete={deleteTodo}
          processedIds={processedId}
        />

        {!!todos.length && (
          <TodoFilter
            filter={currentFilter}
            setFilter={setCurrentFilter}
            onDelete={deleteTodo}
            todos={todos}
          />
        )}
      </div>

      <TodoError
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
