/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { getTodos, addTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorType } from './types/ErrorType';

export enum StatusFilter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [loading, setLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<ErrorType | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTodos();

      setTodos(data);
    } catch {
      setError(ErrorType.UNABLE_TO_LOAD_TODOS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadTodos();
      inputRef.current?.focus();
    };

    init();
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (statusFilter === 'all') {
      return true;
    }

    if (statusFilter === 'active') {
      return !todo.completed;
    }

    if (statusFilter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setError(ErrorType.EMPTY_TITLE);
      {
        return;
      }
    }

    const newTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);
    setIsActionLoading(true);

    try {
      const created = await addTodo(trimmedTitle);

      setTodos(prev => [...prev, created]);
      setNewTitle('');
    } catch {
      setError(ErrorType.UNABLE_TO_ADD_TODO);
    } finally {
      setTempTodo(null);
      setIsActionLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingTodoIds(prev => [...prev, todoId]);
    setIsActionLoading(true);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setError(ErrorType.UNABLE_TO_DELETE_TODO);
    } finally {
      setDeletingTodoIds(prev => prev.filter(id => id !== todoId));

      setIsActionLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    for (const todo of completedTodos) {
      try {
        setDeletingTodoIds(prev => [...prev, todo.id]);
        await deleteTodo(todo.id);
        setTodos(prev => prev.filter(t => t.id !== todo.id));
      } catch {
        setError(ErrorType.UNABLE_TO_DELETE_TODO);
      } finally {
        setDeletingTodoIds(prev => prev.filter(id => id !== todo.id));
      }
    }

    inputRef.current?.focus();
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          onAdd={handleAddTodo}
          inputRef={inputRef}
          disabled={!!tempTodo}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
          // loading={loading}
          deletingTodoIds={deletingTodoIds}
        />

        {todos.length > 0 && (
          <Footer
            todosCount={todos.filter(todo => !todo.completed).length}
            completedCount={todos.filter(todo => todo.completed).length}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}

        <ErrorNotification error={error} setError={setError} />
      </div>
    </div>
  );
};
