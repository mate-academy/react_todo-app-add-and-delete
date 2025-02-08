/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './Components/TodoList/TodoList';
import { Footer } from './Components/Footer/Footer';
import { ErrorMessage } from './Components/Error/ErrorMessage';

export type FilterStatus = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const [title, setTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<Todo | undefined>(undefined);

  const loadedTodos = async () => {
    try {
      setIsLoading(true);
      setError('');

      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch (e) {
      setError('Unable to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }

    loadedTodos();
  }, []);

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [todos, tempTodo, isDeleting]);

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return todo;
    }
  });

  const onSubmit = async (text: string) => {
    if (!text.trim()) {
      return setError('Title should not be empty');
    }

    setError('');
    setIsSubmitting(true);

    const id =
      todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
    const newTodo = {
      userId: USER_ID,
      title: text.trim(),
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      await addTodo(newTodo);
      setTodos(currentTodos => [...currentTodos, { ...newTodo, id }]);
      setTitle('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsSubmitting(false);
    }
  };

  const onDelete = async (id: number) => {
    setError('');
    setIsSubmitting(true);
    setIsDeleting(todos.find(todo => todo.id === id));

    try {
      await deleteTodo(id);
      setTodos(currentTodos => [
        ...currentTodos.filter(todo => todo.id !== id),
      ]);
      setIsDeleting(undefined);
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const deleteResults = await Promise.allSettled(
        completedTodos.map(todo => deleteTodo(todo.id)),
      );

      const successfullyDeletedIds = completedTodos
        .filter((_, index) => deleteResults[index].status === 'fulfilled')
        .map(todo => todo.id);

      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
      );

      if (deleteResults.some(result => result.status === 'rejected')) {
        setError('Unable to delete a todo');
      }
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeTodos = todos.reduce((sum, todo) => {
    return !todo.completed ? sum + 1 : sum;
  }, 0);

  const doneTodos = todos.reduce((sum, todo) => {
    return todo.completed ? sum + 1 : sum;
  }, 0);

  const onToggle = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const getFilter = (filter: FilterStatus) => {
    if (filter) {
      setFilterStatus(filter);
    } else {
      setFilterStatus('all');
    }
  };

  const clearError = () => {
    setError('');
  };

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={() => todos.forEach(todo => onToggle(todo.id))}
            />
          )}

          <form
            onSubmit={e => {
              e.preventDefault();
              onSubmit(title);
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              value={title}
              disabled={isSubmitting}
              onChange={e => {
                setTitle(e.target.value);
              }}
            />
          </form>
        </header>

        {!isLoading && todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              onToggle={onToggle}
              tempTodo={tempTodo}
              isSubmitting={isSubmitting}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
            <Footer
              onChangeFilter={getFilter}
              filterStatus={filterStatus}
              activeTodos={activeTodos}
              doneTodos={doneTodos}
              onClearCompleted={onClearCompleted}
            />
          </>
        )}
      </div>
      <ErrorMessage onClear={clearError} error={error} />
    </div>
  );
};
