import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './components/UserWarning/UserWarning';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Errors } from './components/Errors/Errors';
import { Status } from './types/Status';
import { ErrorSpec } from './types/ErrorSpec';
import { filterTodos } from './helpers/filterTodos';
import * as TodoService from './services/todo';

const USER_ID = 12021;
const ADDED_URL = `/todos?userId=${USER_ID}`;

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [hasErrors, setHasErrors] = useState(false);
  const [error, setError] = useState<ErrorSpec | null>(null);
  const [status, setStatus] = useState<Status>(Status.ALL);
  const [uncompletedTodosCount, setUncompletedTodosCount] = useState<number>(0);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<Todo | null>(null);

  const filteredTodos = useMemo(
    () => filterTodos(todosFromServer, status),
    [status, todosFromServer],
  );

  useEffect(() => {
    client
      .get<Todo[]>(ADDED_URL)
      .then((todos) => {
        setTodosFromServer(todos);

        if (todos.length === 0) {
          setError(ErrorSpec.EMPTY_TITLE);
        }
      })
      .catch(() => setError(ErrorSpec.NOT_LOADED));
  }, []);

  useEffect(() => {
    const completedCount = todosFromServer.filter(
      (todo) => !todo.completed,
    ).length;

    setUncompletedTodosCount(completedCount);
  }, [todosFromServer, status, filteredTodos]);

  const handleStatus = (newStatus: Status) => {
    setStatus(newStatus);
  };

  const cleanErrors = () => {
    setHasErrors(false);
  };

  const addTodo = (title: string) => {
    setInputDisabled(true);
    const preparedTitle = title.trim();

    if (!preparedTitle) {
      setError(ErrorSpec.EMPTY_TITLE);
      setHasErrors(true);
      setInputDisabled(false);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    TodoService.createTodo(newTodo)
      .then((responce) => {
        setTempTodo(responce);
        setTodosFromServer([...todosFromServer, responce]);
      })
      .catch(() => {
        setError(ErrorSpec.NOT_ADDED);
        setInputDisabled(false);
        throw new Error();
      })
      .finally(() => {
        setInputDisabled(false);
        setTempTodo(null);
      });
  };

  const removeTodo = (id: number) => {
    setInputDisabled(true);
    setIsLoading(filteredTodos.find((todo) => todo.id === id) || null);

    TodoService.deleteTodo(id)
      .then(() => setIsLoading(null))
      .catch(() => {
        setError(ErrorSpec.NOT_DELETED);
        setInputDisabled(false);
        throw new Error();
      })
      .finally(() => {
        setTodosFromServer((prev) => prev.filter((todo) => todo.id !== id));
        setInputDisabled(false);
      });
  };

  const clearCompleted = () => {
    filteredTodos.forEach(element => {
      if (element.completed) {
        removeTodo(element.id);
      }
    });
    setUncompletedTodosCount(0);
    setHasErrors(false);
  };

  useEffect(() => {
    setIsLoading(
      filteredTodos.find((todo) => todo.id === isLoading?.id) || null,
    );
  }, [filteredTodos, isLoading]);

  if (!USER_ID) {
    setHasErrors(true);

    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={addTodo}
          onInput={cleanErrors}
          inputDisabled={inputDisabled}
          hasErrors={hasErrors}
        />

        {todosFromServer.length > 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            deleteTodo={removeTodo}
            isProcessing={isLoading}
          />
        )}
        {todosFromServer.length > 0 && (
          <Footer
            onStatus={handleStatus}
            status={status}
            completedCount={uncompletedTodosCount}
            handleClear={clearCompleted}
            isClearNeeded={uncompletedTodosCount === filteredTodos.length}
          />
        )}
      </div>

      {hasErrors && <Errors error={error} closeError={cleanErrors} />}
    </div>
  );
};
