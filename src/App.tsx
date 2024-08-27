/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, USER_ID } from './api/todos';
import { ErrorMessage } from './types/ErrorMessage';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { FilterState } from './types/FilterState';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.Default);
  const [activeFilter, setActiveFilter] = useState(FilterState.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState([0]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const filteredTodos = getFilteredTodos(todos, activeFilter);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LoadTodo));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodos(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos((prev: Todo[]) => prev.filter(todo => todo.id !== todoId)),
      )
      .catch(() => {
        setErrorMessage(ErrorMessage.DeleteTodo);
      })
      .finally(() => {
        setLoadingTodos((prev: number[]) => prev.filter(id => id !== todoId));
      });
  };

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
          todos={filteredTodos}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          loadingTodos={loadingTodos}
        />

        {todos.length && (
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

      <ErrorNotification message={errorMessage} setMessage={setErrorMessage} />
    </div>
  );
};
