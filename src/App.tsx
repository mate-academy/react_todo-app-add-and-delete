/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './TodoList';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { Notification } from './Notification';
import { TodoFooter } from './TodoFooter';
import { FilterType } from './types/Filters';

const USER_ID = 10603;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [isHidden, setIsHidden] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    client.get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(setTodos).catch(() => {
        setError('Unable to load todos');
        setTimeout(() => {
          setError('');
        }, 3000);
      });
  }, []);

  const visibleTodos = useMemo(() => {
    let filteredTodos;

    switch (filterType) {
      case 'completed':
        filteredTodos = todos.filter(todo => todo.completed);
        break;
      case 'active':
        filteredTodos = todos.filter(todo => !todo.completed);
        break;
      default:
        filteredTodos = todos;
        break;
    }

    return filteredTodos;
  }, [filterType, todos]);

  const createTodo = async () => {
    setIsLoading(true);
    if (!query) {
      setError('Title can\'t be empty');
      setTimeout(() => {
        setError('');
      }, 3000);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title: query,
      userId: USER_ID,
      completed: false,
    };

    try {
      setTemporaryTodo(newTodo);

      const createdTodo = await client.post<Todo>('/todos', newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch {
      setError('Unable to add a todo');
      setIsHidden(false);
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setTemporaryTodo(null);
      setIsHidden(true);
      setQuery('');
      setIsLoading(false);
    }
  };

  const deleteTodo = async (todoId: number) => {
    setIsLoading(true);
    try {
      await client.delete(`/todos/${todoId}`);

      setTodos(currentTodos => currentTodos.filter(
        todo => todo.id !== todoId,
      ));
    } catch {
      setError('Unable to delete a todo');
      setIsHidden(false);
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setIsHidden(true);
      setIsLoading(false);
    }
  };

  const clearCompleted = () => {
    const chosenTodos = todos.filter(todo => todo.completed === true);

    const clearedTodos = chosenTodos.forEach(
      todo => client.delete(`/todos/${todo.id}`),
    );

    setTodos(todos.filter(todo => !chosenTodos.includes(todo)));

    return clearedTodos;
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">

          {todos.find(todo => !todo.completed) && (
            <button type="button" className="todoapp__toggle-all active" />
          )}

          <form onSubmit={createTodo}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={!!temporaryTodo}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            onDelete={deleteTodo}
            temporaryTodo={temporaryTodo}
            isLoading={isLoading}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filterType={filterType}
            setFilterType={setFilterType}
            clearCompleted={clearCompleted}
          />
        )}

      </div>

      <Notification
        isHidden={isHidden}
        setIsHidden={setIsHidden}
        error={error}
      />
    </div>
  );
};
