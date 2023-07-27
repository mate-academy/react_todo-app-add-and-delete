/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { SelectStatus } from './types/SelectStatus';
import { TodoError } from './types/TodoError';

const USER_ID = 11123;

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(SelectStatus.All);
  const [errorMesage, setErrorMesage] = useState('');

  useEffect(() => {
    client.get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(todos => setTodosFromServer(todos))
      .catch(() => setErrorMesage(TodoError.load));

    setTimeout(() => setErrorMesage(''), 3000);
  }, []);

  const getFilteredTodos = (todos: Todo[]) => {
    const filteredTodos = [...todos];

    switch (selectedStatus) {
      case SelectStatus.Active:
        return filteredTodos.filter(todo => !todo.completed);

      case SelectStatus.Completed:
        return filteredTodos.filter(todo => todo.completed);

      default:
        return filteredTodos;
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header todos={getFilteredTodos(todosFromServer)} />
        <Main
          todos={getFilteredTodos(todosFromServer)}
          setErrorMesage={setErrorMesage}
        />
        {todosFromServer.length > 0
          && (
            <Footer
              todos={getFilteredTodos(todosFromServer)}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />
          )}
      </div>
      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {errorMesage && (
        <div className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMesage },
        )}
        >
          {errorMesage}

          <button
            type="button"
            className="delete"
            onClick={() => setErrorMesage('')}
          />
        </div>
      )}
    </div>
  );
};
