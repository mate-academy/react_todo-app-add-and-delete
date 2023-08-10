/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos } from './api/todos';
import { Status } from './enum/Status';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './enum/ErrorMessages';
import { Error } from './components/Error/Error';
import { AddTodo } from './components/AddTodo';
import { setErrorWithTimeout } from './utils/setError';
import { TodoItem } from './components/TodoItem';

const USER_ID = 11298;

const getFilterdTodos = (
  todos: Todo[],
  filterBy: Status,
) => {
  switch (filterBy) {
    case Status.all:
      return todos;

    case Status.active:
      return todos.filter(todo => !todo.completed);

    case Status.completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Status>(Status.all);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setIsLoading(true);

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorWithTimeout(
        ErrorMessage.None,
        3000,
        setErrorMessage,
      ))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredTodos = useMemo(() => {
    return getFilterdTodos(todos, filterBy);
  }, [todos, filterBy]);

  const activeTodos = useMemo(() => {
    return filteredTodos.filter(todo => !todo.completed);
  }, [filteredTodos]);

  const handleDeleteTodo = (id: number) => () => {
    setIsLoading(true);

    deleteTodo(id)
      .then(() => setTodos(currentTodos => currentTodos
        .filter(todo => todo.id !== id)))
      .catch((error) => {
        setErrorWithTimeout(
          ErrorMessage.Delete,
          3000,
          setErrorMessage,
        );

        throw error;
      })
      .finally(() => setIsLoading(false));
  };

  const deleteAllCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => setTodos(currentTodos => currentTodos
          .filter(t => !t.completed)))
        .catch((error) => {
          setErrorWithTimeout(
            ErrorMessage.Delete,
            3000,
            setErrorMessage,
          );

          throw error;
        })
        .finally(() => setIsLoading(false));
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {activeTodos && (
            <button type="button" className="todoapp__toggle-all active" />
          )}

          {/* Add a todo on form submit */}
          {/* <form>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form> */}
          <AddTodo
            setTodos={setTodos}
            todos={todos}
            userId={USER_ID}
            setErrorMessage={setErrorMessage}
            setTempTodo={setTempTodo}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={isLoading}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isLoading={isLoading}
            handleDeleteTodo={handleDeleteTodo}
          />
        )}

        <Footer
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          todos={todos}
          deleteAllCompleted={deleteAllCompleted}
        />
      </div>

      {errorMessage && !isLoading && (
        <Error
          error={errorMessage}
          setError={setErrorMessage}
        />
      )}
    </div>
  );
};
