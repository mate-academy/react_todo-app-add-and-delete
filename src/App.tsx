import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { List } from './components/List';
import { Todo } from './types/Todo';
import { ShowError } from './components/ShowError';
import * as todoService from './api/todos';
import { Status } from './types/Status';
import { TodoError } from './types/TodoError';
import { USER_ID } from './utils/userId';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage]
    = useState<TodoError>(TodoError.ErrorOfLoad);
  const [isShowError, setIsShowError] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(items => setTodos(items as Todo[]))
      .catch(() => {
        setErrorMessage(TodoError.ErrorOfLoad);
        setIsShowError(true);
      });
  }, []);

  const handleDeleteTodo = (todoId: number) => {
    todoService.deleteTodo(todoId)
      .then(() => setTodos(item => item.filter(todo => todo.id !== todoId)))
      .catch(() => {
        setTodos(todos);
        setIsShowError(true);
        setErrorMessage(TodoError.ErrorOfDelete);
      });
  };

  const filteredTodos: Todo[] = useMemo(() => {
    const todoList = [...todos];

    switch (filterStatus) {
      case (Status.Active):
        return todoList.filter(todo => !todo.completed);

      case (Status.Completed):
        return todoList.filter(todo => todo.completed);

      default:
        return todoList;
    }
  }, [todos, filterStatus]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          setErrorMessage={setErrorMessage}
          setIsShowError={setIsShowError}
        />

        <List
          todos={filteredTodos}
          handleDeleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            setTodos={setTodos}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ShowError
        errorMessage={errorMessage}
        isShowError={isShowError}
        setIsShowError={setIsShowError}
      />
    </div>
  );
};
