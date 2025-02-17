import React, { useEffect, useState } from 'react';
import { USER_ID, getTodos } from './api/todos';

import ErrorNotification from './components/ErrorNotification';
import Footer from './components/Footer';
import Header from './components/Headre';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import TodoList from './components/TodoList';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingId, setDeletingId] = useState(0);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const onErrorMessage = (message: string) => {
    setErrorMessage(message);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTodos={setTodos}
          onErrorMessage={onErrorMessage}
          setTempTodo={setTempTodo}
          errorMessage={errorMessage}
          deletingId={deletingId}
        />
        <TodoList
          todos={todos}
          setTodos={setTodos}
          onErrorMessage={onErrorMessage}
          tempTodo={tempTodo}
          selectedStatus={selectedStatus}
          setDeletingId={setDeletingId}
          deletingId={deletingId}
        />

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            onErrorMessage={onErrorMessage}
            setIsDeleting={setDeletingId}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
