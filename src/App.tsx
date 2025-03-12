/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { getTodos, addTodo, deleteTodo, updateTodo } from './api/todos';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import Header from './components/Header';
import { FilterType } from './types/FilterType';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>(FilterType.All);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();

      setTodos(data);
      setError(null);
    } catch {
      setError('Unable to load todos');
    } finally {
      setLoading(false);
      focusInput();
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    const title = newTodo.trim();

    if (!title) {
      setError('Title should not be empty');
      focusInput();

      return;
    }

    try {
      setLoading(true);

      const temporaryTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
        isLoading: true,
      };

      setTempTodo(temporaryTodo);

      const createdTodo = await addTodo(title);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
      setNewTodo('');
      setError(null);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setLoading(false);
      setTempTodo(null);

      focusInput();
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, isLoading: true } : todo,
        ),
      );

      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      setError(null);
    } catch {
      setError('Unable to delete a todo');
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, isLoading: false } : todo,
        ),
      );
    } finally {
      focusInput();
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === todo.id ? { ...t, isLoading: true } : t)),
      );

      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(prevTodos =>
        prevTodos.map(t =>
          t.id === todo.id ? { ...updatedTodo, isLoading: false } : t,
        ),
      );
      setError(null);
    } catch {
      setError('Unable to update a todo');
      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === todo.id ? { ...t, isLoading: false } : t)),
      );
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.completed ? { ...todo, isLoading: true } : todo,
      ),
    );

    const deletePromises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => ({ id: todo.id, success: true }))
        .catch(() => ({ id: todo.id, success: false })),
    );

    const results = await Promise.all(deletePromises);

    setTodos(prevTodos => {
      let updatedTodos = [...prevTodos];

      results.forEach(result => {
        if (result.success) {
          updatedTodos = updatedTodos.filter(todo => todo.id !== result.id);
        } else {
          updatedTodos = updatedTodos.map(todo =>
            todo.id === result.id ? { ...todo, isLoading: false } : todo,
          );
          setError('Unable to delete a todo');
        }
      });

      return updatedTodos;
    });

    focusInput();
  };

  const filteredTodos = () => {
    switch (activeFilter) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          handleAddTodo={handleAddTodo}
          todos={todos}
          handleToggleTodo={handleToggleTodo}
          loading={loading}
          inputRef={inputRef}
        />
        <TodoList
          todos={filteredTodos()}
          handleDeleteTodo={handleDeleteTodo}
          handleToggleTodo={handleToggleTodo}
        />

        {tempTodo && (
          <div className="todoapp__temp-todo">
            <TodoList
              todos={[tempTodo]}
              handleDeleteTodo={handleDeleteTodo}
              handleToggleTodo={handleToggleTodo}
            />
          </div>
        )}

        <Footer
          todos={todos}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          handleClearCompleted={handleClearCompleted}
        />
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames('notification', 'is-danger', {
          hidden: error === null,
        })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error || ''}
      </div>
    </div>
  );
};
