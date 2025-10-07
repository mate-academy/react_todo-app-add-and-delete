/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, addTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/ErrorMessage';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  // #region state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorMessage | ''>('');
  const [filter, setFilter] = useState<FilterStatus>('All');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const focusRef = useRef<HTMLInputElement>(null);
  // #endregion

  // #region effect
  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setTempTodo(null);

    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.LoadTodos))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      focusRef.current?.focus();
    }
  }, [loading]);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!isDisabled) {
      focusRef.current?.focus();
    }
  }, [isDisabled]);

  useEffect(() => {
    if (selectedIds.length === 0) {
      focusRef.current?.focus();
    }
  }, [selectedIds]);
  // #endregion

  // #region func
  const filteredTodos = (() => {
    switch (filter) {
      case 'Active':
        return todos.filter(t => !t.completed);
      case 'Completed':
        return todos.filter(t => t.completed);
      case 'All':
      default:
        return todos;
    }
  })();

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = focusRef.current;

    if (!title.trim()) {
      setError(ErrorMessage.EmptyTitle);
      setTimeout(() => setError(''), 3000);

      return;
    }

    setIsDisabled(true);
    input?.blur();

    const newTemp: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTemp);

    addTodo(newTemp)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setError(ErrorMessage.AddTodo);
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
      });
  }

  function handleDelete(todoId: number) {
    setSelectedIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError(ErrorMessage.DeleteTodo);
      })
      .finally(() => {
        setSelectedIds(prev => prev.filter(id => id !== todoId));
      });
  }

  function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  }
  // #endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {loading ? (
          <p>Loading</p>
        ) : (
          <>
            <TodoForm
              focusRef={focusRef}
              handleAdd={handleAdd}
              isDisabled={isDisabled}
              title={title}
              setTitle={setTitle}
            />
            <TodoList
              todos={filteredTodos}
              onDelete={handleDelete}
              selectedIds={selectedIds}
            />
            {tempTodo && (
              <TodoItem
                key={tempTodo.id}
                todo={tempTodo}
                onDelete={handleDelete}
                selectedIds={selectedIds}
                isTemp={true}
              />
            )}
            <Footer
              todos={todos}
              filter={filter}
              onFilterChange={setFilter}
              activeCount={activeCount}
              completedCount={completedCount}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification message={error} onClear={() => setError('')} />
    </div>
  );
};
