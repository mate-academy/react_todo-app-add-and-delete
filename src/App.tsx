/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useState,
} from 'react';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { FilterStatus } from './types/FilterStatus';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);

  const user = useContext(AuthContext);

  const getTodosFromServer = async () => {
    if (!user) {
      return;
    }

    try {
      const receivedTodos = await getTodos(user.id);

      setTodos(receivedTodos);
    } catch (err) {
      setError('No todos were loaded!');
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const submitTodo = (newTodo: Todo) => {
    setTodos([...todos, newTodo]);
  };

  const setFiltredTodos = (filitredTodos: Todo[]) => {
    setTodos(filitredTodos);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          submitTodo={submitTodo}
          onSetError={setError}
        />
        <TodoList
          todos={todos}
          filterStatus={filterStatus}
          onSetTodos={setFiltredTodos}
          onSetError={setError}
        />
        <Footer
          onStatusClick={setFilterStatus}
          todos={todos}
          filterStatus={filterStatus}
        />
      </div>

      <ErrorMessage
        errorMessage={error}
        setErrorMessage={setError}
      />
    </div>
  );
};
