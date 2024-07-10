/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';

import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterBy } from './types/FilterBy';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [valueError, setValueError] = useState('');
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [isNotificationHidden, setIsNotificationHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const autoHideNotification = () => {
    setTimeout(() => {
      setIsNotificationHidden(true);
    }, 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todosFromServer = await todoService.getTodos();

        setTodos(todosFromServer);
      } catch (error) {
        setValueError('Unable to load todos');
        setIsNotificationHidden(false);
        autoHideNotification();
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  });

  const addTodo = async (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const deleteTodo = async (todoId: number) => {
    setIsLoading(true);
    try {
      await todoService.deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      inputRef.current?.focus();
    } catch (error) {
      setValueError('Unable to delete a todo');
      setIsNotificationHidden(false);
      autoHideNotification();
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const filteredTodos = todos.filter((todo: Todo) => {
    switch (filterBy) {
      case FilterBy.Active:
        return !todo.completed;
      case FilterBy.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleFilter = (selectedFilter: FilterBy) => {
    setFilterBy(selectedFilter);
  };

  const handleCloseNotifications = () => {
    setIsNotificationHidden(true);
  };

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setValueError={setValueError}
          setIsNotificationHidden={setIsNotificationHidden}
          autoHideNotification={autoHideNotification}
          onAdd={addTodo}
          setTempTodo={setTempTodo}
          inputRef={inputRef}
        />

        {filteredTodos.length > 0 && (
          <TodoList
            filteredTodos={filteredTodos}
            tempTodo={tempTodo}
            onDelete={deleteTodo}
            isLoading={isLoading}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filterBy}
            onFilter={handleFilter}
            onDelete={deleteTodo}
          />
        )}
      </div>

      <ErrorNotification
        valueError={valueError}
        isNotificationHidden={isNotificationHidden}
        onClose={handleCloseNotifications}
      />
    </div>
  );
};
