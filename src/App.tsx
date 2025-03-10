/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/Filter';
import Header from './Header';
import { TodoItem } from './TodoItem';
import { Footer } from './Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const headerRef = useRef<HTMLInputElement>(null); // Типізуємо як HTMLInputElement

  useEffect(() => {
    const loadTodos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (err) {
        setError('Unable to load todos');
        setTimeout(() => setError(null), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filter === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  const handleAdd = async (
    newTodo: Todo,
    onSuccess: () => void,
    onError: () => void,
  ) => {
    setIsLoading(true);
    setError(null);
    setTempTodo(newTodo);

    try {
      const createdTodo = await addTodo(newTodo.title);

      setTodos(prev => [...prev, createdTodo]);
      onSuccess();
    } catch (err) {
      handleError('Unable to add a todo');
      onError();
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const handleDelete = async (todoId: number) => {
    if (todoId === 0) {
      return;
    }

    setProcessingIds(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
      if (headerRef.current) {
        headerRef.current.focus(); // Фокусуємо поле напряму через реф
      }
    } catch (err) {
      handleError('Unable to delete a todo');
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const deletePromises = completedTodos.map(todo => handleDelete(todo.id));

    await Promise.all(deletePromises);
  };

  const handleCloseError = () => {
    setError(null);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          ref={headerRef}
          allCompleted={todos.every(todo => todo.completed)}
          isLoading={isLoading}
          onAdd={handleAdd}
          onError={handleError}
        />

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isLoading={processingIds.includes(todo.id)}
                onDelete={handleDelete}
              />
            ))}
            {tempTodo && <TodoItem todo={tempTodo} isLoading />}
          </section>
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={hasCompleted}
            isLoading={isLoading}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleCloseError}
        />
        {error}
      </div>
    </div>
  );
};
