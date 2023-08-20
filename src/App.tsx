/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { Main } from './components/Main/Main';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { Errors } from './types/Errors';
import { Filters } from './types/Filters';
import { TodosContext } from './utils/TodosContext';
import { ErrorContext } from './utils/ErrorContextProvider';

export const USER_ID = 11338;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { error, errorVisibility, showError } = useContext(ErrorContext);
  const [filter, setFilter] = useState(Filters.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAllDeleting, setIsAllDeleting] = useState(false);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Filters.Active: {
        return todos.filter(todo => !todo.completed);
      }

      case Filters.Completed: {
        return [...todos].filter(todo => todo.completed);
      }

      default: {
        return todos;
      }
    }
  }, [todos, filter, isAllDeleting]);

  const addTodoHandler = ({
    id,
    userId,
    title,
    completed,
  }: Todo) => {
    setTempTodo({
      id,
      userId,
      title,
      completed,
    });

    return createTodo({ title, userId, completed })
      .then((newTodo) => setTodos((current) => [...current, newTodo]))
      .catch(() => showError(Errors.Add))
      .finally(() => setTempTodo(null));
  };

  const deleteAllHandler = () => {
    setIsAllDeleting(true);

    Promise.all(todos.filter(todo => todo.completed)
      .map(todo => deleteTodo(todo.id)))
      .then(() => setTodos(currentTodos => {
        return currentTodos.filter(todo => !todo.completed);
      }))
      .catch(() => showError(Errors.Delete))
      .finally(() => setIsAllDeleting(false));
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((setTodos))
      .catch(() => {
        showError(Errors.Load);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodosContext.Provider value={{ todos, setTodos }}>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header
            onError={showError}
            userId={USER_ID}
            onAdd={addTodoHandler}
          />

          <Main
            todos={visibleTodos}
            tempTodo={tempTodo}
            isAllDeleting={isAllDeleting}
          />

          {!!todos.length && (
            <Footer
              filter={filter}
              onFilter={(value) => setFilter(value)}
              onClear={() => {
                setIsAllDeleting(true);
                deleteAllHandler();
              }}
            />
          )}
        </div>

        <ErrorMessage
          error={error}
          isVisible={errorVisibility}
        />
      </div>
    </TodosContext.Provider>
  );
};
