/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { Status } from './types/status';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState(Status.All);
  const [isTodosLoaded, setIsTodosLoaded] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleChangeStatus = (
    status: Status,
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    setFilterStatus(status);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });

    setTimeout(() => {
      setIsTodosLoaded(true);
    }, 1000);
  }, []);

  const getFilteredTodos = useMemo(() => {
    switch (filterStatus) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [filterStatus, todos]);

  function handleDelete(todoId: number) {
    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          setError={setErrorMessage}
          setTempTodo={setTempTodo}
        />
        {isTodosLoaded && (
          <TodoList
            getFilteredTodos={getFilteredTodos}
            todos={todos}
            setTodos={setTodos}
            handleDelete={handleDelete}
            error={setErrorMessage}
            tempTodo={tempTodo}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && isTodosLoaded && (
          <Footer
            todos={todos}
            handleDelete={handleDelete}
            handleChangeStatus={handleChangeStatus}
            filterStatus={filterStatus}
          />
        )}
      </div>

      <ErrorMessage errorMessage={errorMessage} />
    </div>
  );
};
