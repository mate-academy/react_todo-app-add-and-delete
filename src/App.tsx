/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect,
} from 'react';
import { getTodos } from './api/todos';
import { AddTodo } from './components/Auth/AddTodo/AddTodo';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorWindow } from './components/Auth/ErrorWindow/ErrorWindow';
// eslint-disable-next-line
import { FilterComponent } from './components/Auth/FilterComponent/FilterComponent';
import { TodoList } from './components/Auth/TodoList/TodoList';
import { TodoContext } from './context/TodoContext';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const {
    setFiltredTodos,
    filterState,
    handleFilter,
    todos,
    setTodos,
    loadError,
    setLoadError,
    errorMessage,
    setErrorMessage,
    setAllCompletedLoader,
    handleStatusChange,
  } = useContext(TodoContext);

  useEffect(() => {
    setTimeout(() => setLoadError(false), 3000);
  }, [loadError]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        if (user) {
          const todoData = await getTodos(user.id);

          setTodos(todoData);
          setFiltredTodos(todoData);
        }
      } catch (_) {
        setLoadError(true);
        setErrorMessage('Unable to load todos from server');
      }
    };

    loadTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddTodo
          userId={user?.id}
          setTodos={setTodos}
          handleFilter={handleFilter}
          filterState={filterState}
          todos={todos}
          setLoadError={setLoadError}
          setErrorMessage={setErrorMessage}
        />

        <TodoList />

        {todos.length > 0 && (
          <FilterComponent
            todos={todos}
            filterState={filterState}
            handleFilter={handleFilter}
            setTodos={setTodos}
            setAllCompletedLoader={setAllCompletedLoader}
            handleStatusChange={handleStatusChange}
            setErrorMessage={setErrorMessage}
            setLoadError={setLoadError}
          />
        )}
      </div>

      <ErrorWindow
        loadError={loadError}
        setLoadError={setLoadError}
        errorMessage={errorMessage}
      />

    </div>
  );
};
