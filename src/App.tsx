/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import { deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorType } from './types/ErrorType';
import { FilterStatus } from './types/FilterStatus';
import { TempTodo, Todo } from './types/Todo';
import { client } from './utils/fetchClient';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [error, setError] = useState(ErrorType.None);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const getTodosFromServer = async () => {
    if (!user) {
      return;
    }

    try {
      const receivedTodos = await getTodos(user.id);

      setTodos(receivedTodos);
    } catch (err) {
      setError(ErrorType.LoadingError);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const addTodo = async (title: string) => {
    setIsLoading(true);
    setTempTodo({ id: 0, title, completed: false });

    try {
      const todo = {
        userId: user?.id,
        title,
        completed: false,
      };

      const newTodo = await client.post<Todo>('/todos', todo);

      setTodos(current => [...current, newTodo]);
      setNewTitle('');
    } catch (err) {
      setError(ErrorType.InsertionError);
    } finally {
      setTempTodo(null);
    }

    setIsLoading(false);
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const activeTodosCount = activeTodos.length;
  const completedTodos = todos.filter(todo => todo.completed);
  const completedTodosCount = completedTodos.length;

  const deleteCompletedTodos = async () => {
    try {
      setIsLoading(true);
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
      setTodos(activeTodos);
      setIsLoading(false);
    } catch (err) {
      setError(ErrorType.RemovalError);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isLoading={isLoading}
          setError={setError}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          addTodo={addTodo}
        />
        <TodoList
          todos={todos}
          filterStatus={filterStatus}
          tempTodo={tempTodo}
        />
        <Footer
          activeTodosCount={activeTodosCount}
          setFilterStatus={setFilterStatus}
          filterStatus={filterStatus}
          deleteCompletedTodos={deleteCompletedTodos}
          completedTodosCount={completedTodosCount}
        />
      </div>

      <ErrorMessage
        error={error}
        setError={setError}
      />
    </div>
  );
};
