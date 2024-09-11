/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { Options } from './types/Options';
import { Errors } from './types/Errors';
import { filterTodos } from './api/filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [selectedOption, setSelectedOption] = useState<Options>(Options.All);
  const [focus, setFocus] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState<{ [key: number]: boolean }>(
    {},
  );

  const filteredTodos = filterTodos(todos, selectedOption);
  const activeTodos = filterTodos(todos, Options.Active);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const showError = useCallback(
    (error: Errors) => {
      setErrorMessage(error);

      setTimeout(() => {
        clearError();
      }, 3000);
    },
    [clearError],
  );

  useEffect(() => {
    setFocus(true);

    todoService
      .getTodo()
      .then(setTodos)
      .catch(() => showError(Errors.LoadTodos));
  }, [showError]);

  const addTodo = useCallback(
    async ({ userId, title, completed }: Omit<Todo, 'id'>) => {
      const newTempTodo: Todo = {
        id: 0,
        userId,
        title,
        completed,
      };

      setTempTodo(newTempTodo);

      try {
        const newTodo = await todoService.createTodo({
          userId,
          title,
          completed,
        });

        setTodos(currentTodo => [...currentTodo, newTodo]);
      } catch {
        showError(Errors.AddTodo);
        throw new Error();
      } finally {
        setTempTodo(null);
        setFocus(true);
      }
    },
    [showError],
  );

  const deleteTodo = useCallback(
    async (todoId: number) => {
      setLoadingTodos(prev => ({ ...prev, [todoId]: true }));

      try {
        await todoService.deleteTodo(todoId);
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
        setFocus(true);
      } catch {
        showError(Errors.DeleteTodo);
      } finally {
        setLoadingTodos(prev => ({ ...prev, [todoId]: false }));
      }
    },
    [showError],
  );

  const onToogleAll = async (completed: boolean) => {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed,
    }));

    const loadingState = todos.reduce<{ [key: number]: boolean }>(
      (acc, todo) => ({
        ...acc,
        [todo.id]: true,
      }),
      {},
    );

    setLoadingTodos(loadingState);

    try {
      setTodos(updatedTodos);
    } catch {
      showError(Errors.UpdateTodo);
    } finally {
      setLoadingTodos({});
    }
  };

  const clearCompleted = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.map(async todo => {
      try {
        await deleteTodo(todo.id);
      } catch {
        showError(Errors.DeleteTodo);
      }
    });
  }, [todos, showError, deleteTodo]);

  const toggleCompleted = useCallback((todoId: number) => {
    setTodos(currentTodo =>
      currentTodo.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          showError={showError}
          onAddTodo={addTodo}
          onToogleAll={onToogleAll}
          focusInput={focus}
          setFocusInput={setFocus}
        />

        <TodoList
          filteredTodos={filteredTodos}
          onDeleteTodo={deleteTodo}
          tempTodo={tempTodo}
          onToggleComplete={toggleCompleted}
          loadingTodos={loadingTodos}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            selected={selectedOption}
            setSelected={setSelectedOption}
            onClearCompleted={clearCompleted}
            activeTodos={activeTodos}
          />
        )}
      </div>

      <ErrorMessage errorMessage={errorMessage} clear={clearError} />
    </div>
  );
};
