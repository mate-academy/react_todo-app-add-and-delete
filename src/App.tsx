/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

type StatusFilter = Filter;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(Filter.All);
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const completedCount = todos.filter(todo => todo.completed).length;

  const loadTodos = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getTodos();

      setTodos(data);
    } catch (err) {
      setError('Unable to load todos');

      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleFilterChange = (newFilter: Filter) => {
    setStatusFilter(newFilter);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      setTimeout(() => setError(''), 3000);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setIsCreating(true);
    setTempTodo({ ...newTodo, id: 0 });

    try {
      const createdTodo = await addTodo(newTodo);

      setTodos(current => [...current, createdTodo]);
      setTitle('');
    } catch {
      setError('Unable to add a todo');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsCreating(false);
      setTempTodo(null);
    }
  };

  const handleDelete = async (todoId: number) => {
    setDeletingTodoIds(ids => [...ids, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));
      inputRef.current?.focus();
    } catch {
      setError('Unable to delete a todo');
      setTimeout(() => setError(''), 3000);
    } finally {
      setDeletingTodoIds(ids => ids.filter(id => id !== todoId));
    }
  };

  const onClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      setDeletingTodoIds(current => [...current, todo.id]);

      deleteTodo(todo.id)
        .then(() => {
          setTodos(current => current.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          setError('Unable to delete a todo');
        })
        .finally(() => {
          setDeletingTodoIds(current => current.filter(id => id !== todo.id));
        });
    });

    inputRef.current?.focus();
  };

  const filteredTodos = todos.filter(todo => {
    if (statusFilter === Filter.Active) {
      return !todo.completed;
    }

    if (statusFilter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {loading && (
        <div data-cy="Loader" className="todoapp__loader">
          <div className="loader" />
        </div>
      )}

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          isCreating={isCreating}
          inputRef={inputRef}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={handleDelete}
          deletingTodoIds={deletingTodoIds}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            statusFilter={statusFilter}
            onFilterChange={handleFilterChange}
            onClearCompleted={onClearCompleted}
            completedCount={completedCount}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Error error={error} />
    </div>
  );
};
