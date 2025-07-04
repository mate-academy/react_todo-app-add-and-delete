/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateCompleted,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { StatusFilter } from './types/TodosStatus';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<StatusFilter>(StatusFilter.All);
  const [query, setQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();

      setTodos(data);
    } catch {
      setErrorMessage('Unable to load todos');
    } finally {
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  // add todo
  const handleAddTodo = async (title: string) => {
    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
      loading: true,
    };

    setTempTodo(newTempTodo);
    setIsAdding(true);

    try {
      const data = await addTodo(title.trim());

      setTodos(currentTodos => [...currentTodos, data]);
      setQuery('');
      inputRef.current?.focus();
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  // delete todo
  const handleDeleteTodo = async (id: number) => {
    setDeletingTodoIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(currentTodos => currentTodos.filter(t => t.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setDeletingTodoIds(prev => prev.filter(t => t !== id));
      inputRef.current?.focus();
    }
  };

  // toggle todo
  const toggleTodo = async (todo: Todo) => {
    try {
      const data = await updateCompleted(todo.id, !todo.completed);

      setTodos(currentTodos =>
        currentTodos.map(t => (t.id === todo.id ? data : t)),
      );
    } catch {
      setErrorMessage('Unable to update a todo');
    }
  };

  // clear completed
  const handleClearCompleted = async () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (completedIds.length === 0) {
      return;
    }

    setDeletingTodoIds(current => [...current, ...completedIds]);

    const results = await Promise.allSettled(
      completedIds.map(id => deleteTodo(id)),
    );

    const successfulIds = completedIds.filter(
      (_, i) => results[i].status === 'fulfilled',
    );

    const failedIds = completedIds.filter(
      (_, i) => results[i].status === 'rejected',
    );

    if (failedIds.length > 0) {
      setErrorMessage('Unable to delete a todo');
    }

    setTodos(current =>
      current.filter(todo => !successfulIds.includes(todo.id)),
    );

    setDeletingTodoIds(current =>
      current.filter(id => !completedIds.includes(id)),
    );

    inputRef.current?.focus();
  };

  useEffect(() => {
    const filtered = todos.filter(todo => {
      switch (status) {
        case StatusFilter.Active:
          return !todo.completed;
        case StatusFilter.Completed:
          return todo.completed;
        case StatusFilter.All:
        default:
          return todo;
      }
    });

    setFilteredTodos(filtered);
  }, [status, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleAddTodo(query);
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={e => setQuery(e.target.value)}
              ref={inputRef}
              autoFocus
              disabled={isAdding}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          toggleTodo={toggleTodo}
          deleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
          deletingTodoIds={deletingTodoIds}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            status={status}
            onStatusChange={setStatus}
            onClearCompleted={handleClearCompleted}
            hasCompleted={todos.some(todo => todo.completed)}
          />
        )}
      </div>

      <Error
        errorMessage={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
