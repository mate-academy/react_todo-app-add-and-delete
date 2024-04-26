import React, { useEffect, useState } from 'react';
import { UserWarning } from '../../UserWarning';
import * as todosService from '../../api/todos';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { Header } from '../Header/Header';
import { TodoList } from '../TodoList/TodoList';
import { Footer } from '../Footer/Footer';
import { Status } from '../../types/Status';

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState(Status.All);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(`Unable to load todos`);
      });
  }, []);

  useEffect(() => {
    if (errorMessage || !todos.length) {
      const timeout = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timeout);
    }

    return;
  }, [errorMessage, todos]);

  if (!todosService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          setErrorMessage={setErrorMessage}
          loadingTodoIds={loadingTodoIds}
          setLoadingTodoIds={setLoadingTodoIds}
          setTempTodo={setTempTodo}
        />

        <TodoList
          todos={todos}
          setTodos={setTodos}
          statusFilter={statusFilter}
          setErrorMessage={setErrorMessage}
          loadingTodoIds={loadingTodoIds}
          setLoadingTodoIds={setLoadingTodoIds}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            setErrorMessage={setErrorMessage}
            setLoadingTodoIds={setLoadingTodoIds}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
