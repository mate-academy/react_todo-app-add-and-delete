/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
//#region import
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
//#endregion

export const App: React.FC = () => {
  function prepairedTodo(todos: Todo[], status: string, query: string): Todo[] {
    let result = [...todos];

    enum TodoStatus {
      All = 'all',
      Active = 'active',
      Completed = 'completed',
    }

    switch (status) {
      case TodoStatus.All:
        break;
      case TodoStatus.Active:
        result = result.filter(todo => !todo.completed);
        break;
      case TodoStatus.Completed:
        result = result.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    if (query.trim()) {
      const normalizedQuery = query.toLowerCase();

      result = result.filter(todo =>
        todo.title.toLowerCase().includes(normalizedQuery),
      );
    }

    return result;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [error, setError] = useState<ErrorType>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const visibleTodos = prepairedTodo(todos, status, query);
  const allTodos = tempTodo ? [...visibleTodos, tempTodo] : visibleTodos;

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('LOAD_TODOS'));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function handleEmptyTitle() {
    setError('EMPTY_TITLE');
  }

  function handleCreateTodo(title: string): Promise<void> {
    if (!USER_ID) {
      return Promise.resolve();
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setIsAdding(true);
    setError(null);

    return createTodo({ title, userId: USER_ID, completed: false })
      .then((newTodo: Todo) => {
        setTodos(prev => [...prev, newTodo]);
        setTempTodo(null);
        setIsAdding(false);
      })
      .catch(() => {
        setError('ADD_TODO');
        setTempTodo(null);
        setIsAdding(false);
        throw new Error();
      });
  }

  function handleDeleteTodo(id: number) {
    if (id === 0) {
      return;
    }

    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, isDeleting: true } : todo)),
    );

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        setTimeout(() => inputRef.current?.focus(), 0);
      })
      .catch(() => {
        setError('DELETE_TODO');
        setTodos(prev =>
          prev.map(todo =>
            todo.id === id ? { ...todo, isDeleting: false } : todo,
          ),
        );
      });
  }

  function handleUpdateTodo(id: number, data: Partial<Todo>) {
    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, isUpdating: true } : todo)),
    );

    return updateTodo(id, data)
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(todo =>
            todo.id === id ? { ...updatedTodo, isUpdating: false } : todo,
          ),
        );
      })
      .catch(() => {
        setError('UPDATE_TODO');
        setTodos(prev =>
          prev.map(todo =>
            todo.id === id ? { ...todo, isUpdating: false } : todo,
          ),
        );
        throw new Error();
      });
  }

  function toggleTodo(id: number) {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    handleUpdateTodo(id, { completed: !todo.completed });
  }

  function clearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  function toggleAll() {
    const areAllCompleted = todos.every(todo => todo.completed);

    if (areAllCompleted) {
      todos.forEach(todo => {
        handleUpdateTodo(todo.id, { completed: false });
      });
    } else {
      todos
        .filter(todo => !todo.completed)
        .forEach(todo => {
          handleUpdateTodo(todo.id, { completed: true });
        });
    }
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onCreate={handleCreateTodo}
          onEmpty={handleEmptyTitle}
          hasActiveTodos={todos.length > 0}
          onToggleAll={toggleAll}
          areAllCompleted={todos.length > 0 && todos.every(t => t.completed)}
          inputRef={inputRef}
        />
        <TodoList
          todos={allTodos}
          onDelete={handleDeleteTodo}
          onToggle={toggleTodo}
        />
        {todos.length > 0 && (
          <Footer
            onStatusChange={setStatus}
            status={status}
            todos={todos}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError(null)} />
    </div>
  );
};
