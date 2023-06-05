import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import Footer from './components/Footer';
import TodoList from './components/TodoList';

export const userId = 10590;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [newTodo, setNewTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTodos = () => {
    client
      .get<Todo[]>(`/todos?userId=${userId}`)
      .then((receivedTodos) => {
        setTodos(receivedTodos);
      })
      .catch(() => {
        setError('Unable to fetch todos data');
      });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleFilterChange = (type: string) => {
    setFilterType(type);
  };

  const handleCloseError = () => {
    setError(null);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }

    return () => {};
  }, [error]);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodo.trim() !== '') {
      setIsLoading(true);
      setTempTodo({
        id: 0,
        title: newTodo,
        completed: false,
        userId,
      });
      setNewTodo('');

      try {
        const response = await client.post<Todo>('/todos', {
          title: newTodo,
          completed: false,
          userId,
        });

        setTodos((prevTodos) => [...prevTodos, response]);
        setTempTodo(null);
        setIsLoading(false);
      } catch (apiError) {
        setError('Unable to add a todo');
        setTempTodo(null);
        setIsLoading(false);
      }
    } else {
      setError("Title can't be empty");
    }
  };

  const handleDeleteTodo = (id: number) => {
    client
      .delete(`/todos/${id}`)
      .then(() => {
        fetchTodos();
      })
      .catch(() => {
        setError('Unable to delete a todo');
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    setIsLoading(true);

    Promise.all(completedTodos.map((todo) => client.delete(`/todos/${todo.id}`)))
      .then(() => {
        fetchTodos();
        setIsLoading(false);
      })
      .catch(() => {
        setError('Unable to delete completed todos');
        setIsLoading(false);
      });
  };

  if (!userId) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <form onSubmit={handleAddTodo}>
          <input
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            disabled={isLoading}
          />
        </form>

        {tempTodo !== null && (
          <div className="todoapp__item todoapp__item--loading">
            <div className="loader" />
            <span>{tempTodo.title}</span>
          </div>
        )}

        <TodoList
          todos={todos}
          filterType={filterType}
          onDeleteTodo={handleDeleteTodo}
        />

        <Footer
          todos={todos}
          filterType={filterType}
          onFilterChange={handleFilterChange}
          onClearCompleted={handleClearCompleted}
        />
      </div>

      {error && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button
            type="button"
            className="delete"
            onClick={handleCloseError}
            aria-label="Close"
          />
          {error}
        </div>
      )}
    </div>
  );
};

export default App;
