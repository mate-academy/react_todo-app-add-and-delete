/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { addTodo, getTodos } from './api/todos';
import { Header } from './components/Header';
import { Todos } from './components/Todos';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { Todo } from './types/Todo';
import { FilterOptions } from './types/FilterOptions';
import { UserWarning } from './UserWarning';
import { Errors } from './types/Errors';

const USER_ID = 6133;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [updatingTodos, setUpdatingTodos] = useState(false);
  const [filter, setFilter] = useState(FilterOptions.All);
  const [notification, setNotification] = useState(Errors.None);
  const [hideNotification, setHideNotification] = useState(false);

  const handleError = (error: Errors) => {
    setHideNotification(false);
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
        handleError(Errors.CantGet);
      });
  }, []);

  useEffect(() => {
    if (newTodoTitle.length) {
      const todoToAdd = {
        id: 0,
        userId: USER_ID,
        title: newTodoTitle,
        completed: false,
      };

      setUpdatingTodos(true);

      addTodo(todoToAdd)
        .then(newTodo => {
          setTodos([...todos, newTodo]);
        })
        .catch(() => {
          handleError(Errors.CantAdd);
        })
        .finally(() => {
          setUpdatingTodos(false);
        });
    }
  }, [newTodoTitle]);

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
        <Header
          setNewTodoTitle={setNewTodoTitle}
          onInputError={() => handleError(Errors.EmptyTitle)}
          disable={updatingTodos}
        />
        <Todos todos={filteredTodos} />
        <Footer
          todos={todos}
          currentFilter={filter}
          onSelectFilter={setFilter}
        />
      </div>

      <Notification
        message={notification}
        hidden={hideNotification}
        setHideNotification={setHideNotification}
      />
    </div>
  );
};
