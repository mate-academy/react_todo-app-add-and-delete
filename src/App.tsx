/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useState, useCallback, useMemo,
} from 'react';
import { TodosList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { Header } from './Components/Header';
import { Message } from './Components/Message';
import { Todo, Status } from './types/Todo';
import { prepareTodos } from './utils/preparedTodos';
import { callAddTodo, callDeleteTodo, callGetTodos } from './api/todos';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 6414;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.ALL);
  const [errorType, setErrorType] = useState<ErrorMessage>(ErrorMessage.NONE);
  const [isError, setIsError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const todosFromServer = await callGetTodos(USER_ID);

        setTodos(todosFromServer);
        setIsError(false);
      } catch (error) {
        setIsError(true);
        if (error instanceof Error) {
          setErrorType(ErrorMessage.NONE);
        }
      }
    };

    getTodos();
  }, []);

  const handleInput = (value: string) => {
    setQuery(value);
  };

  const addTodo = useCallback(async (titleOfTodo: string) => {
    if (!titleOfTodo) {
      setErrorType(ErrorMessage.TITLE);
      setIsError(true);

      return;
    }

    const newTodo: Todo = {
      userId: USER_ID,
      title: titleOfTodo,
      completed: false,
      id: 0,
    };

    try {
      setTempTodo(newTodo);
      const createdTodo = await callAddTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);

      setQuery('');
      setIsError(false);
    } catch (error) {
      setIsError(true);
      setErrorType(ErrorMessage.ADD);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const deleteTodo = useCallback(async (id: number) => {
    try {
      await callDeleteTodo(id);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorType(ErrorMessage.DELETE);
      setIsError(true);
    }
  }, []);

  const deleteCompleted = () => {
    const filteredTodos = todos.filter(todo => todo.completed);

    filteredTodos.forEach(todo => deleteTodo(todo.id));
  };

  const visibleTodos = useMemo(() => {
    return prepareTodos(status, todos);
  }, [status, todos]);

  const clearNotification = useCallback(() => {
    setIsError(false);
  }, []);

  const notCompletedTodos = todos.filter(todo => !todo.completed).length;

  const isAllTodosActive = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos, notCompletedTodos]);

  const isTodosNotEmpty = !!todos.length;
  const isClearButtonVisible = todos.some(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          setQuery={handleInput}
          isAllTodosActive={isAllTodosActive}
          isTodosNotEmpty={isTodosNotEmpty}
          addTodo={addTodo}
          tempTodo={tempTodo}
        />
        <TodosList
          todos={visibleTodos}
          deleteTodo={deleteTodo}
        />

        {isTodosNotEmpty
             && (
               <Footer
                 status={status}
                 setStatus={setStatus}
                 notCompletedTodos={notCompletedTodos}
                 isClearButtonVisible={isClearButtonVisible}
                 deleteCompleted={deleteCompleted}
               />
             )}
      </div>

      <Message
        errorType={errorType}
        isError={isError}
        clearNotification={clearNotification}
      />
    </div>
  );
};
