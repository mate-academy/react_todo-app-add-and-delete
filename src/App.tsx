/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoApp } from './components/TodoApp';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterStatus } from './types/FilterStatus';
import { ErrorNotification } from './components/ErrorNotification';
import { Result } from './types/Results';

const prepareTodos = (todos: Todo[], filterStatus: FilterStatus): Todo[] => {
  return todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;

      case FilterStatus.Completed:
        return todo.completed;

      case FilterStatus.All:
        return true;
    }
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastAction, setLastAction] = useState(0);

  const filteredTodos = useMemo(() => {
    return prepareTodos(todos, filterStatus);
  }, [todos, filterStatus]);

  const todosLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const isAllTodosCompleted = useMemo(() => {
    return todos.length > 0 && todos.every(todo => todo.completed);
  }, [todos]);

  const isHasCompletedTodos = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const handleLoadTodos = async () => {
    setErrorMessage(null);

    try {
      const apiTodos = await getTodos();

      setTodos(apiTodos);
    } catch (error) {
      setErrorMessage(ErrorMessage.UnableToLoadTodos);
    }
  };

  const handleNewTodoFormSubmit = async (
    formResult: Result,
  ): Promise<boolean> => {
    setIsLoading(true);

    if (!formResult.isSuccess) {
      setErrorMessage(formResult.error);
      setIsLoading(false);

      return false;
    }

    setTempTodo({
      id: 0,
      title: formResult.value,
      userId: USER_ID,
      completed: false,
    });

    try {
      const apiResult = await addTodo({
        title: formResult.value,
        userId: USER_ID,
        completed: false,
      });

      setTodos(currentTodos => [...currentTodos, apiResult]);
      setTempTodo(null);

      return true;
    } catch (error) {
      setErrorMessage(ErrorMessage.CantAddTodo);
      setTempTodo(null);

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleTodoDelete = async (todoId: number): Promise<boolean> => {
    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      setLastAction(Date.now()); // trigger input refocus

      return true;
    } catch (error) {
      setErrorMessage(ErrorMessage.CantDeleteTodo);

      return false;
    }
  };

  const handleClearCompletedTodos = async () => {
    try {
      const deletionPromises = todos.map(async todo => {
        if (!todo.completed) {
          return todo;
        }

        try {
          await deleteTodo(todo.id);

          return null;
        } catch (error) {
          setErrorMessage(ErrorMessage.CantDeleteTodo);

          return todo;
        }
      });

      const results = await Promise.all(deletionPromises);

      setTodos(results.filter(todo => todo !== null));

      setLastAction(Date.now()); // trigger input refocus
    } catch (error) {
      setErrorMessage(ErrorMessage.CantDeleteTodo);
    }
  };

  useEffect(() => {
    handleLoadTodos();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoApp
        isLoading={isLoading}
        filteredTodos={filteredTodos}
        allTodos={todos}
        todosLeft={todosLeft}
        tempTodo={tempTodo}
        isAllTodosCompleted={isAllTodosCompleted}
        isHasCompletedTodos={isHasCompletedTodos}
        filterStatus={filterStatus}
        lastAction={lastAction}
        onFilterChange={setFilterStatus}
        onNewTodoFormSubmit={handleNewTodoFormSubmit}
        onTodoDelete={handleTodoDelete}
        onClearCompletedTodos={handleClearCompletedTodos}
      />

      <ErrorNotification
        errorMessage={errorMessage}
        onHideErrorButtonClick={() => setErrorMessage(null)}
      />
    </div>
  );
};
