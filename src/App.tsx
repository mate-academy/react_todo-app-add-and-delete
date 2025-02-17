import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ErrorField } from './components/ErrorField/ErrorField';
import { FilterState } from './types/FilterState';
import { getPreparedTodos } from './utils/getPreperedTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterState>(
    FilterState.ALL,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState([0]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const preparedTodos = getPreparedTodos(todos, activeFilter);

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodos(prev => [...prev, todoId]);
    deleteTodo(todoId)
      .then(() =>
        setTodos((prev: Todo[]) => prev.filter(todo => todo.id !== todoId)),
      )
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodos((prev: number[]) => prev.filter(id => id !== todoId));
      });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
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
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
        />

        <TodoList
          todos={preparedTodos}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          loadingTodos={loadingTodos}
        />

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            handleDeleteTodo={handleDeleteTodo}
          />
        )}
      </div>

      <ErrorField
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
