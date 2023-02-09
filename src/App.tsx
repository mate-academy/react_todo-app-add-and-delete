/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { getTodos } from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { Todos } from './components/Todos';
import { FilterOptions } from './types/FilterOptions';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 6133;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterOptions.All);
  const [notification, setNotification] = useState('');
  const [hideNotification, setHideNotification] = useState(false);

  const handleError = (error: string) => {
    setNotification(error);
    setTimeout(() => {
      setHideNotification(true);
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(loadedTodos => {
        setTodos(loadedTodos);
      }).catch(() => {
        handleError('Unable to load Todos');
      });
  }, []);

  const filteredTodos = todos.filter(({
    completed,
  }) => {
    const { Active, Completed } = FilterOptions;

    switch (filter) {
      case Active:
        return !completed;
      case Completed:
        return completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        <Todos todos={filteredTodos} />
        <Footer
          todos={todos}
          currentFilter={filter}
          onSelectFilter={setFilter}
        />
      </div>

      {/* Added following button for review/testing behaviour, will be removed on the next task */}
      <button
        type="button"
        className="button is-warning active mb-2"
        onClick={() => {
          setHideNotification(false);
          handleError('in case of error, this behaviour...');
        }}
      >
        test error notification
      </button>

      <Notification
        message={notification}
        hidden={hideNotification}
        setHideNotification={setHideNotification}
      />
    </div>
  );
};
