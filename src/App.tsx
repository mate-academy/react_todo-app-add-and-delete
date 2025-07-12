import React, { useEffect, useState, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { getTodos, postTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !isAdding) {
      inputRef.current?.focus();
    }
  }, [isLoading, isAdding]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setIsLoading(true);
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      setError('Title should not be empty');

      return;
    }

    const newTodoData: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTodoData);
    setError('');
    setIsAdding(true);

    try {
      const createdTodo = await postTodo(newTodoData);

      setTodos(current => [...current, createdTodo]);
      setNewTodoTitle('');
    } catch {
      setError('Unable to add a todo');
      setNewTodoTitle(title);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const handleDeleteTodo = async (id: number) => {
    setDeletingTodoId(id);
    setError('');

    try {
      await deleteTodo(id);
      setTodos(current => current.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setDeletingTodoId(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          onSubmit={handleAddTodo}
          inputRef={inputRef}
          value={newTodoTitle}
          onChange={setNewTodoTitle}
          disabled={isLoading || isAdding}
        />
        {isLoading && (
          <div
            data-cy="TodoLoader"
            className={`todo__loader-overlay ${isLoading ? 'is-active' : ''}`}
          >
            Loading...
          </div>
        )}
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deletingTodoId={deletingTodoId}
          onDelete={handleDeleteTodo}
        />
        {todos.length > 0 && (
          <Footer
            activeCount={todos.filter(t => !t.completed).length}
            completedCount={todos.filter(t => t.completed).length}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={() => {
              const completedIds = todos
                .filter(t => t.completed)
                .map(t => t.id);

              completedIds.forEach(id => handleDeleteTodo(id));
            }}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!error ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
