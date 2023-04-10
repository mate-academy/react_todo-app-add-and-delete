/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { deleteTodo as deleteTodoById, getTodos, postTodo } from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';
import { AppError } from './types/ApiError';
import { filterTodos, FilterType } from './helpers/filterTodos';
import { TodoItem } from './components/TodoItem';

const USER_ID = 6950;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [errorType, setErrorType] = useState(AppError.None);
  const [filterType, setFilterType] = useState(FilterType.None);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [
    deletingAllCompletedTodos,
    setDeletingAllCompletedTodos,
  ] = useState(false);

  const fetchTodos = async () => {
    try {
      const apiTodos = await getTodos(USER_ID);

      setTodos(apiTodos);
    } catch {
      setHasError(true);
      setErrorType(AppError.Get);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const visibleTodos = useMemo(
    () => filterTodos(todos, filterType),
    [filterType, todos],
  );

  const addTodo = async (title: string) => {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    const newTodo = await postTodo(title, USER_ID);

    setTempTodo(null);
    setTodos(prev => [...prev, newTodo]);
  };

  const deleteTodoFromServer = async (todoId: number) => {
    await deleteTodoById(todoId);

    fetchTodos();
  };

  const deleteAllCompleted = async () => {
    const completedTodos = todos.filter(({ completed }) => completed);

    setDeletingAllCompletedTodos(true);
    await Promise.all(completedTodos.map(({ id }) => deleteTodoById(id)));
    await fetchTodos();
    setDeletingAllCompletedTodos(false);
  };

  const getHasCompletedTodos = () => {
    return todos.some(({ completed }) => completed);
  };

  const getActiveTodosCount = () => {
    return todos.filter(({ completed }) => !completed).length;
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isLoading={!!tempTodo}
          hasActiveTodos={!getActiveTodosCount()}
          onAdd={addTodo}
        />

        <TodoList
          deletingAllCompleted={deletingAllCompletedTodos}
          onDelete={deleteTodoFromServer}
          todos={visibleTodos}
        />

        {tempTodo && <TodoItem onDelete={() => {}} todo={tempTodo} />}

        {!todos.length
          || (
            <Footer
              activeTodosCount={getActiveTodosCount()}
              hasCompletedTodo={getHasCompletedTodos()}
              setFilter={setFilterType}
              deleteAllCompleted={deleteAllCompleted}
              filterType={filterType}
            />
          )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {hasError && (
        <ErrorMessage
          removeErrorMessage={() => setHasError(false)}
          errorType={errorType}
        />
      )}
    </div>
  );
};
