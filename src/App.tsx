/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { FiltersType } from './types/FiltersType';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorTypes } from './types/ErrorTypes';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorTodos, setErrorTodos] = useState(ErrorTypes.NoErrors);
  const [status, setStatus] = useState(FiltersType.All);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingTodosIds, setDeletingTodosIds] = useState<number[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleErrorClose = () => {
    setErrorTodos(ErrorTypes.NoErrors);
  };

  const visibleTodos = todos?.filter(todo => {
    switch (status) {
      case FiltersType.Completed:
        return todo.completed;
      case FiltersType.Active:
        return !todo.completed;
      default:
        return true;
    }
  });

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );
  const completedTodosCount = completedTodos.length;

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(data => setTodos(data))
      .catch(() => {
        setErrorTodos(ErrorTypes.Loading);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const onAddTodo = async (newTodo: Omit<Todo, 'id'>): Promise<void> => {
    try {
      const createdTodo = await createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
    } catch (error) {
      setErrorTodos(ErrorTypes.Add);
      throw error;
    }
  };

  const onDeleteTodo = async (todoId: number) => {
    setDeletingTodosIds(currentIds => [...currentIds, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorTodos(ErrorTypes.Delete);
      throw error;
    } finally {
      setDeletingTodosIds(currentIds => currentIds.filter(id => id !== todoId));
    }
  };

  const onDeleteAllCompleted = () => {
    completedTodos.forEach(completedTodo => {
      onDeleteTodo(completedTodo.id);
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          completedTodosCount={completedTodosCount}
          onAddTodo={onAddTodo}
          setErrorTodos={setErrorTodos}
          tempTodo={tempTodo}
          setTempTodo={setTempTodo}
        />

        {todos?.length && (
          <>
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={onDeleteTodo}
              isDataLoading={isLoading}
              deletingTodosIds={deletingTodosIds}
              tempTodo={tempTodo}
            />

            <Footer
              activeCount={activeTodosCount}
              completedCount={completedTodosCount}
              status={status}
              setStatus={setStatus}
              onDeleteAllCompleted={onDeleteAllCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        error={errorTodos}
        handleErrorClose={handleErrorClose}
      />
    </div>
  );
};
