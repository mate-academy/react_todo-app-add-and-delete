/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { TodosList } from './components/TodosList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notifications } from './components/Notifications';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Status } from './types/Status';
import { ErrorTypes } from './types/ErrorTypes';
import { RequestTodo } from './types/RequestTodo';

const USER_ID = 6325;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status>(Status.ALL);
  const [errorType, setErrorType] = useState<ErrorTypes>(ErrorTypes.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoIdsToDelete, setTodoIdisToDelete] = useState<number[]>([]);
  let visibleTodos = todos;

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorType(ErrorTypes.UPLOAD_ERROR);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const handleInput = (value: string) => {
    setQuery(value);
  };

  const handleFormSubmit = async () => {
    if (query === '') {
      setErrorType(ErrorTypes.EMPTY_TITLE);
    } else {
      const newTodo: RequestTodo = {
        userId: USER_ID,
        title: query,
        completed: false,
      };

      setTempTodo({
        ...newTodo,
        id: 0,
      });

      try {
        const todoFromServer = await addTodo(USER_ID, newTodo);

        setTodos(prevState => [...prevState, todoFromServer]);
        setTempTodo(null);
        setQuery('');
      } catch (error) {
        setErrorType(ErrorTypes.ADD_ERROR);
      }
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    if (!todoId) {
      return;
    }

    try {
      const deletionResponse = await deleteTodo(todoId);

      if (await deletionResponse === 1) {
        setTodos(visibleTodos.filter(todo => todo.id !== todoId));
      }
    } catch (error) {
      setErrorType(ErrorTypes.DELETE_ERROR);
    }
  };

  const clearAll = async (todosToDelete: number[]) => {
    setTodoIdisToDelete(todosToDelete);
    try {
      const deletionPromises = todosToDelete.map(deleteTodo);

      const response = await Promise.all(deletionPromises);

      if (response.every(res => res === 1)) {
        setTodos(visibleTodos.filter(todo => !todosToDelete.includes(todo.id)));
      }
    } catch (error) {
      setErrorType(ErrorTypes.DELETE_ERROR);
    }
  };

  switch (status) {
    case Status.ALL:
      visibleTodos = todos;
      break;
    case Status.ACTIVE:
      visibleTodos = todos.filter(todo => !todo.completed);
      break;
    case Status.COMPLETED:
      visibleTodos = todos.filter(todo => todo.completed);
      break;
    default:
      throw new Error('Unexpected status');
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          query={query}
          setQuery={handleInput}
          handleFormSubmit={handleFormSubmit}
        />
        <TodosList
          todos={visibleTodos}
          tempTodo={tempTodo}
          todoIdsToDelete={todoIdsToDelete}
          handleDeleteTodo={handleDeleteTodo}
        />

        {todos.length > 0
          && (
            <Footer
              todos={visibleTodos}
              status={status}
              setStatus={setStatus}
              clearAll={clearAll}
            />
          )}
      </div>
      <Notifications
        errorType={errorType}
      />
    </div>
  );
};
