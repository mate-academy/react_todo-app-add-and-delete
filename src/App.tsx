/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, USER_ID_G } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/Errors';
enum FilterType {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}
export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    if (inputRef.current && !tempTodo) {
      inputRef.current.focus();
    }
  }, [tempTodo, todos]);
  const loadTodos = async (userId: number) => {
    try {
      setLoading(true);
      setError('');
      const data = await getTodos(userId);

      setTodos(data);
    } catch (err) {
      setError((err as Error).message || 'Unable to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (USER_ID_G) {
      loadTodos(USER_ID_G);
    }
  }, []);
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);
  if (!USER_ID_G) {
    return <UserWarning />;
  }

  const handleHideError = () => {
    setError('');
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  });
  const handleTodoStatusChange = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  setTimeout(() => {
    if (inputRef.current && !tempTodo) {
      inputRef.current.focus();
    }
  }, 50);
  const handleDelete = async (id: number) => {
    setDeletingTodoIds(prev => [...prev, id]);
    await new Promise(resolve => setTimeout(resolve, 0));
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Unable to delete a todo');
    } finally {
      setDeletingTodoIds(prev => prev.filter(todoId => todoId !== id));
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter(todo => todo.completed);
    const results = await Promise.allSettled(
      completed.map(todo => deleteTodo(todo.id)),
    );
    const successfullyDeleted = completed.filter(
      (_, index) => results[index].status === 'fulfilled',
    );

    setTodos(prev =>
      prev.filter(todo => !successfullyDeleted.some(td => td.id === todo.id)),
    );
    if (results.some(result => result.status === 'rejected')) {
      setError('Unable to delete a todo');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          setTodos={setTodos}
          setLoading={setLoading}
          setError={setError}
          todos={todos}
          setTempTodo={setTempTodo}
          tempTodo={tempTodo}
        />
        <TodoList
          todos={filteredTodos}
          onTodoStatusChange={handleTodoStatusChange}
          onDelete={handleDelete}
          tempTodo={tempTodo}
          loading={loading}
          deletingTodoIds={deletingTodoIds}
        />
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification error={error} onHideError={handleHideError} />
    </div>
  );
};
