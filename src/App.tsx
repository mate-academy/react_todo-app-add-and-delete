/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
// import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { removeTodo, getTodos, createTodo } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Errors } from './types/ErrorType';
import { Header } from './components/Header';

const USER_ID = 11693;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterType.All);
  const [title, setTitle] = useState('');
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.loading);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  const filteredTodos: Todo[] = useMemo(() => {
    let preparedTodos = [...todos];

    if (filter !== FilterType.All) {
      preparedTodos = preparedTodos.filter(todo => {
        switch (filter) {
          case FilterType.Active:
            return !todo.completed;

          case FilterType.Completed:
            return todo.completed;

          default:
            return true;
        }
      });
    }

    return preparedTodos;
  }, [todos, filter]);

  // const activeTodos = todos.filter(todo => !todo.completed).length;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return setErrorMessage(Errors.title);
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo);
    setIsError(true);

    return createTodo(newTodo)
      .then((finalTodo: Todo) => {
        setTodos(currentTodo => [...currentTodo, finalTodo]);
        setTitle('');
      })
      .catch(() => setErrorMessage(Errors.add))
      .finally(() => {
        setIsError(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setIsLoading(currentTodo => [...currentTodo, todoId]);

    removeTodo(todoId)
      .then(() => setTodos(currentTodo => currentTodo
        .filter(todo => todo.id !== todoId)))
      .catch(() => setErrorMessage(Errors.delete))
      .finally(() => setIsLoading(currentTodo => currentTodo
        .filter((id: number) => id !== todoId)));
  };

  // const handleClearCompleted = () => {
  //   setTodos(todos.filter(todo => !todo.completed));
  // };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          isDisabled={isError}
          title={title}
          setTitle={setTitle}
          onHandleSubmit={handleSubmit}
        />

        {filteredTodos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            deleteTodo={deleteTodo}
            isLoading={isLoading}
            tempTodo={tempTodo}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
