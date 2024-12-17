/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { filterTodos } from './utils/getFilteredTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingTodos, setDeletingTodos] = useState<number[]>([]);

  const filteredTodos = filterTodos(todos, filterStatus);

  const handleCreateTodo = async (newTodo: Omit<Todo, 'id'>) => {
    setErrorMessage('');
    setTempTodo({ id: 0, ...newTodo });
    setIsLoading(true);
    try {
      const createdTodo = await addTodos(newTodo);

      setTodos(prev => [...prev, createdTodo]);
    } catch {
      setErrorMessage('Unable to add a todo');
      throw new Error('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setIsLoading(true);
    setDeletingTodos(current => [...current, id]);
    try {
      await deleteTodos(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
      setDeletingTodos([]);
      throw new Error('Unable to delete a todo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => handleDeleteTodo(todo.id)));
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setErrorMessage={setErrorMessage}
          handleCreateTodo={handleCreateTodo}
          isLoading={isLoading}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
            deletingTodos={deletingTodos}
          />
        )}

        {!!todos.length && (
          <Footer
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            todos={todos}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
