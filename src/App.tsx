import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export type FilterType = 'all' | 'active' | 'completed';

const USER_ID = 4201;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideError = () => {
    setErrorMessage('');

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }
  };

  const showError = (message: string) => {
    setErrorMessage(message);

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!isInputDisabled) {
      inputRef.current?.focus();
    }
  }, [isInputDisabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    hideError();

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setIsInputDisabled(true);

    setTimeout(() => {
      createTodo({ userId: USER_ID, title: trimmedTitle, completed: false })
        .then(createdTodo => {
          setTodos(prev => [...prev, createdTodo]);
          setTitle('');
        })
        .catch(() => showError('Unable to add a todo'))
        .finally(() => {
          setTempTodo(null);
          setIsInputDisabled(false);
        });
    }, 0);
  };

  const handleDelete = (id: number) => {
    setLoadingIds(prev => [...prev, id]);

    setTimeout(() => {
      deleteTodo(id)
        .then(() => {
          setTodos(prev => prev.filter(todo => todo.id !== id));
        })
        .catch(() => showError('Unable to delete a todo'))
        .finally(() => {
          setLoadingIds(prev => prev.filter(lid => lid !== id));
          inputRef.current?.focus();
        });
    }, 0);
  };

  const handleToggle = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleClearCompleted = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...completedIds]);

    Promise.allSettled(
      completedIds.map(id =>
        deleteTodo(id)
          .then(() => {
            setTodos(prev => prev.filter(t => t.id !== id));
          })
          .catch(() => showError('Unable to delete a todo'))
          .finally(() => {
            setLoadingIds(prev => prev.filter(lid => lid !== id));
          }),
      ),
    ).then(() => {
      inputRef.current?.focus();
    });
  };

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          isInputDisabled={isInputDisabled}
          inputRef={inputRef}
          onTitleChange={setTitle}
          onSubmit={handleSubmit}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              loadingIds={loadingIds}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />

            <Footer
              todos={todos}
              filter={filter}
              onFilterChange={setFilter}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} onHide={hideError} />
    </div>
  );
};
