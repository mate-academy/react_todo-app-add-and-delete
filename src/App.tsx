/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { getTodos, createTodo } from './api/todos';

import { UserWarning } from './components/UserWarning/UserWarning';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification';

import type { Todo } from './types/Todo';
import { StatusFilter } from './types/StatusFilter';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 12039;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState(StatusFilter.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const timerId = useRef<NodeJS.Timeout>();

  const showErrorNotification = useCallback((error: ErrorMessage) => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    setErrorMessage(error);
    timerId.current = setTimeout(() => setErrorMessage(null), 3000);
  }, []);

  const hideErrorNotification = useCallback(() => setErrorMessage(null), []);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showErrorNotification(ErrorMessage.LOAD_ERROR));
  }, []);

  const todosToRender = useMemo(() => todos.filter(todo => {
    switch (statusFilter) {
      case StatusFilter.ACTIVE:
        return !todo.completed;

      case StatusFilter.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  }), [todos, statusFilter]);

  const addTodo = useCallback((title: string): Promise<void> => {
    setTempTodo({
      title,
      id: 0,
      userId: USER_ID,
      completed: false,
    });

    return createTodo(title, USER_ID)
      .then(newTodo => setTodos(currentTodos => [...currentTodos, newTodo]));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={addTodo}
          setTempTodo={setTempTodo}
          showErrorNotification={showErrorNotification}
        />

        {todos.length !== 0 && (
          <>
            <TodoList todos={todosToRender} tempTodo={tempTodo} />

            <Footer
              todos={todos}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onHide={hideErrorNotification}
      />
    </div>
  );
};
