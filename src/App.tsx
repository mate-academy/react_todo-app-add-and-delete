/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { ErrorType } from './types/Error';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer';
import { Filter } from './types/FilterConditions';
import { USER_ID } from './constants';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isError, setIsError] = useState<ErrorType>(ErrorType.None);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [processing, setProcessing] = useState<number[]>([]);

  useEffect(() => {
    const uploadTodos = async () => {
      try {
        const uploadedTodos = await getTodos(USER_ID);

        setTodos(uploadedTodos);
      } catch (error) {
        setIsError(ErrorType.Load);
      }
    };

    uploadTodos();
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      case Filter.All:
      default:
        return [...todos];
    }
  }, [todos, filter]);

  useEffect(() => {
    const timerId = setTimeout(() => setIsError(ErrorType.None), 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [isError]);

  const handleErrorNotification = () => {
    setIsError(ErrorType.None);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onChangeTempTodo={setTempTodo}
          onChangeTodos={setTodos}
          onChangeError={setIsError}
          onChangeProcessing={setProcessing}
        />

        <TodoList
          preparedTodos={filteredTodos}
          tempTodo={tempTodo}
          processing={processing}
          onChangeTodos={setTodos}
          onChangeError={setIsError}
          onChangeProcessing={setProcessing}
        />

        {todos.length && (
          <Footer
            todos={todos}
            filter={filter}
            onChangeFilter={setFilter}
            onChangeError={setIsError}
            onChangeTodos={setTodos}
            onChangeProcessing={setProcessing}
          />
        )}
      </div>

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: isError === ErrorType.None,
        },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={handleErrorNotification}
        />
        {isError}
      </div>
    </div>
  );
};
