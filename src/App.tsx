/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filters } from './types/Filters';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';

const USER_ID = 11564;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isVisibleErrorMessage, setIsVisibleErrorMessage]
  = useState<boolean>(false);
  const [filterTodos, setFilterTodos] = useState<Filters>('All');

  const handleFilterTodos
  = (todosArray: Todo[], option: Filters): Todo[] => {
    return todosArray.filter((todo) => {
      if (option === 'Active') {
        return !todo.completed;
      }

      if (option === 'Completed') {
        return todo.completed;
      }

      return true;
    });
  };

  const MadeTodoList = () => {
    return handleFilterTodos(todos, filterTodos);
  };

  useEffect(() => {
    setIsVisibleErrorMessage(false);
    client.get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then((data) => setTodos(data))
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setIsVisibleErrorMessage(true);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {todos.some((todo) => !todo.completed) && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <TodoList
          todos={MadeTodoList()}
          setTodos={setTodos}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            todos={todos}
            filterTodos={filterTodos}
            setFilterTodos={setFilterTodos}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      <ErrorMessage
        errorMessage={errorMessage}
        isVisibleErrorMessage={isVisibleErrorMessage}
        setIsVisibleErrorMessage={setIsVisibleErrorMessage}
      />
    </div>
  );
};
