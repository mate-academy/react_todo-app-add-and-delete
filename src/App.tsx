/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useEffect, useRef, useCallback } from 'react';
import * as postServise from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { Filter } from './types/Filter';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    setError(null);
    setIsAdding(true);

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    try {
      const createdTodo = await postServise.createTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTitle('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleToggle = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const filters: readonly Filter[] = [
    { label: 'All', value: FilterStatus.All },
    { label: 'Active', value: FilterStatus.Active },
    { label: 'Completed', value: FilterStatus.Completed },
  ];

  const filteredTodos = todos.filter(todo => {
    if (filterStatus === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filterStatus === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  const loadTodos = useCallback(() => {
    setError(null);

    return postServise
      .getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  const handleDelete = async (id: number) => {
    setDeletingIds(prev => [...prev, id]);

    try {
      await postServise.deleteTodo(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setDeletingIds(prev => prev.filter(i => i !== id));

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => handleDelete(todo.id)));
  };

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  useEffect(() => {
    loadTodos();
    inputRef.current?.focus();
  }, [loadTodos]);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleToggleAll = () => {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    setTodos(updatedTodos);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allCompleted={allCompleted}
          onToggleAll={handleToggleAll}
          inputRef={inputRef}
          title={title}
          isAdding={isAdding}
          onTitleChange={setTitle}
          onSubmit={handleAddTodo}
          hasTodos={todos.length > 0}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onToggle={handleToggle}
            handleDelete={handleDelete}
            deletingIds={deletingIds}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            filters={filters}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            activeTodosCount={activeTodosCount}
            hasCompleted={hasCompleted}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
