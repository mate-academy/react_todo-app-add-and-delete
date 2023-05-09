/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { getTodos } from './api/todos';

import { Status, ErrorMessage } from './types';
import { TodoForm } from './components/TodoForm';
import { TodoFooter } from './components/TodoFooter';
import { TodoError } from './components/TodoError';
import { TodosContext } from './components/TodosContext/TodosContext';

export const App: FC = () => {
  const {
    todos,
    setTodos,
    error,
    setError,
    filterStatus,
    USER_ID,
  } = useContext(TodosContext);

  useEffect(() => {
    setError(null);

    getTodos(USER_ID)
      .then(response => {
        setTodos(response);
      })
      .catch((fetchingError: Error) => {
        setError(ErrorMessage.Load);
        throw new Error(fetchingError.message);
      });
  }, []);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filterStatus === Status.Active) {
        return !todo.completed;
      }

      if (filterStatus === Status.Completed) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filterStatus]);

  const activeTodosCount = useMemo(() => {
    return visibleTodos
      .filter(todo => !todo.completed).length;
  }, [visibleTodos]);

  const completedTodos = useMemo(() => {
    return visibleTodos
      .filter(todo => todo.completed);
  }, [visibleTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          activeTodosCount={activeTodosCount}
        />

        {todos.length > 0 && (
          <>
            <TodoList visibleTodos={visibleTodos} />
            <TodoFooter
              activeTodosCount={activeTodosCount}
              completedTodos={completedTodos}
            />
          </>
        )}
      </div>

      {error && (
        <TodoError />
      )}
    </div>
  );
};
