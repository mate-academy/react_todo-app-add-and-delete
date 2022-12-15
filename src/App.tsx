/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { createTodo, deleteTodo, getTodos } from './api/todos';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState('All');
  const [error, setError] = useState('');
  const [hasError, setHasError] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const getTodosFromServer = useCallback(async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch (err) {
        setHasError(true);
        setError('error: failed to load todos list');
      }
    }
  }, []);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const addTodo = async (data: Omit<Todo, 'id'>) => {
    try {
      setHasError(false);
      setIsAdding(true);

      const todo = await createTodo(data);

      setTitle('');
      setTodos(previousTodos => [...previousTodos, todo]);
      setIsAdding(false);
    } catch (err) {
      setHasError(true);
      setError('error: failed to add todo');
    }
  };

  const delTodo = async (todoId: number) => {
    try {
      setHasError(false);
      await deleteTodo(todoId);
      await getTodosFromServer();
    } catch (err) {
      setHasError(true);
      setError('error: failed to delete todo');
    }
  };

  const clearCompleted = async () => {
    try {
      setHasError(false);

      await Promise.all(completedTodos.map(async (todo) => {
        await deleteTodo(todo.id);
      }));

      await getTodosFromServer();
    } catch (err) {
      setHasError(true);
      setError('error: failed to clear completed todos');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          user={user}
          title={title}
          onTitleChange={setTitle}
          setError={setError}
          setHasError={setHasError}
          onSubmit={addTodo}
          isAdding={isAdding}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              status={status}
              todos={todos}
              newTodoTitle={title}
              isAdding={isAdding}
              onDelete={delTodo}
            />

            <Footer
              status={status}
              setStatus={setStatus}
              activeTodos={activeTodos}
              onClear={clearCompleted}
              completedTodos={completedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        error={error}
        setError={setError}
        hasError={hasError}
        setHasError={setHasError}
      />
    </div>
  );
};
