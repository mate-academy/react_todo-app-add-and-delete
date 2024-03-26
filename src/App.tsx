/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
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
  const [todoMain, setTodoMain] = useState(false);
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
        }, 4000);
      });

    setTimeout(() => {
      setTodoMain(true);
    }, 1000);
  }, []);

  const filteredTodos = () => {
    switch (filterStatus) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  function destroy(todoId: number) {
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
        }, 4000);
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
          error={setErrorMessage}
          setTempTodo={setTempTodo}
        />
        {todoMain && (
          <TodoList
            filteredTodos={filteredTodos}
            todos={todos}
            setTodos={setTodos}
            destroy={destroy}
            error={setErrorMessage}
            tempTodo={tempTodo}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && todoMain && (
          <Footer
            todos={todos}
            destroy={destroy}
            handleChangeStatus={handleChangeStatus}
            filterStatus={filterStatus}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <ErrorMessage errorMessage={errorMessage} />
    </div>
  );
};
