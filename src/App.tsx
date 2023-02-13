/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Header } from './components/Header';
import { Todos } from './components/Todos';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { Todo } from './types/Todo';
import { FilterOptions } from './types/FilterOptions';
import { UserWarning } from './UserWarning';
import { Error } from './types/Errors';

const USER_ID = 6133;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [updatingTodos, setUpdatingTodos] = useState<number[]>([]);
  const [filter, setFilter] = useState(FilterOptions.All);
  const [notification, setNotification] = useState(Error.None);
  const [hideNotification, setHideNotification] = useState(false);

  const handleError = (error: Error) => {
    setHideNotification(false);
    setNotification(error);
    setTimeout(() => {
      setHideNotification(true);
    }, 3000);
  };

  const handleDeleteTodo = (id: number) => {
    setUpdatingTodos(current => [...current, id]);
    deleteTodo(id)
      .then(() => setTodos(currentTodos => {
        return currentTodos.filter(todo => todo.id !== id);
      }))
      .catch(() => handleError(Error.CantDelete))
      .finally(() => {
        setUpdatingTodos(current => current
          .filter(updatingId => updatingId !== id));
      });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(loadedTodos => {
        setTodos(loadedTodos);
      }).catch(() => {
        handleError(Error.CantGet);
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

      setTodos(current => [...current, todoToAdd]);
      setUpdatingTodos(current => [...current, todoToAdd.id]);

      addTodo(todoToAdd)
        .then(newTodo => {
          setTodos([...todos, newTodo]);
        })
        .catch(() => {
          handleError(Error.CantAdd);
        })
        .finally(() => {
          setNewTodoTitle('');
          setUpdatingTodos(current => current
            .filter(id => id !== todoToAdd.id));
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
          onInputError={() => handleError(Error.EmptyTitle)}
          disable={updatingTodos}
        />
        <Todos
          todos={filteredTodos}
          onDeleteTodo={handleDeleteTodo}
          updatingTodos={updatingTodos}
        />
        <Footer
          todos={todos}
          currentFilter={filter}
          onSelectFilter={setFilter}
          onDeleteTodo={handleDeleteTodo}
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
