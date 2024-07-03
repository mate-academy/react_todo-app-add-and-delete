/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, getTodos, postTodo } from './api/todos';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  timer.current = window.setTimeout(() => setErrorMessage(''), 3000);

  const hideError = () => {
    clearTimeout(timer.current);
    setErrorMessage('');
  };

  const addPost = (title: string): Promise<void> => {
    setErrorMessage('');

    return postTodo(title)
      .then((newTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        throw error;
      });
  };

  const onDelete = (id: number) => {
    return deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
        setShouldFocus(true);
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      });
  };

  const onCompleteDelete = useMemo(() => {
    return () => {
      todos.filter(todo => todo.completed).forEach(todo => onDelete(todo.id));
    };
  }, [todos]);

  const unCompletedTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const preparedTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          unCompletedTodos={unCompletedTodos}
          todosLength={todos.length}
          setErrorMessage={setErrorMessage}
          addPost={value => addPost(value)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setTempTodo={setTempTodo}
          shouldFocus={shouldFocus}
          setShouldFocus={setShouldFocus}
        />

        <TodoList
          preparedTodos={preparedTodos}
          onDelete={onDelete}
          tempTodo={tempTodo}
          isLoading={isLoading}
        />

        {todos.length > 0 && (
          <Footer
            unCompletedTodos={unCompletedTodos}
            filter={filter}
            setFilter={setFilter}
            length={todos.length}
            onCompleteDelete={onCompleteDelete}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {errorMessage}
      </div>
    </div>
  );
};
