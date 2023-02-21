import React, { useEffect, useState } from 'react';
import { getTodos, addTodo, removeTodo } from './api/todos';

import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { Footer } from './components/Footer';
import { TodosList } from './components/TodosList';

import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorTypes } from './types/ErrorTypes';
import { RequestTodo } from './types/RequestTodo';

export const USER_ID = 6341;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<ErrorTypes>(ErrorTypes.NONE);
  const [status, setStatus] = useState<Status>(Status.ALL);

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError(ErrorTypes.UPLOAD_ERROR);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const addNewTodo = async () => {
    if (!query) {
      setError(ErrorTypes.EMPTY_TITLE);

      return;
    }

    const newTodo: RequestTodo = {
      userId: USER_ID,
      completed: false,
      title: query,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    try {
      await addTodo(USER_ID, newTodo);
      await getTodosFromServer();
    } catch {
      setError(ErrorTypes.ADD_ERROR);
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      await removeTodo(todoId);
      await getTodosFromServer();
    } catch {
      setError(ErrorTypes.DELETE_ERROR);
    }
  };

  const deleteCompletedTodos = async () => {
    todos.filter(todo => todo.completed).forEach(todo => deleteTodo(todo.id));
  };

  const visibleTodos = todos.filter(todo => {
    switch (status) {
      case Status.ACTIVE:
        return !todo.completed;

      case Status.COMPLETED:
        return todo.completed;

      case Status.ALL:
        return true;

      default:
        throw new Error('Unexpected status');
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          query={query}
          setQuery={setQuery}
          handleAddTodo={addNewTodo}
        />

        <TodosList
          todos={visibleTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            status={status}
            setStatus={setStatus}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      {error !== ErrorTypes.NONE && (
        <Notification
          error={error}
        />
      )}
    </div>
  );
};
