import React, { useState, useRef, useEffect } from 'react';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { ErrorMessage } from './types/ErrorMessage';
import { Header } from './components/Header';
import { TodoList } from './components/Todolist';
import { Footer, Filter } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import {
  createTodo,
  getTodos,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { TempTodoItem } from './components/TempTodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // блокировка input

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const hideError = () => setError('');

  useEffect(() => {
    hideError();
    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.LOAD));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hideError();

    const trimmed = title.trim();

    if (!trimmed) {
      showError(ErrorMessage.EMPTY_TITLE);

      return;
    }

    const temp: Todo = {
      id: 0,
      title: trimmed,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);
    setIsSubmitting(true);
    // setTitle(''); // очищаем поле ввода

    createTodo({ title: trimmed })
      .then(todo => {
        setTodos(prev => [...prev, todo]);
        setTempTodo(null);
        setTitle('');
        inputRef.current?.focus();
      })
      .catch(() => {
        showError(ErrorMessage.ADD);
        setTempTodo(null);
        setTitle(trimmed); // возвращаем текст в поле
      })
      .finally(() => {
        setIsSubmitting(false);
        // inputRef.current?.focus();
      });
  };

  const handleDelete = (id: number) => {
    hideError();
    setLoadingIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => showError(ErrorMessage.DELETE))
      .finally(() => {
        setLoadingIds(prev => prev.filter(tid => tid !== id));
        inputRef.current?.focus();
      });
  };

  const toggleTodo = (todo: Todo) => {
    hideError();
    setLoadingIds(prev => [...prev, todo.id]);

    updateTodo(todo.id, {
      completed: !todo.completed,
      title: todo.title.trim(),
    })
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      })
      .catch(() => showError(ErrorMessage.UPDATE))
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todo.id));
      });
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  const clearCompleted = async () => {
    const completedTodos = todos.filter(t => t.completed);

    if (completedTodos.length === 0) {
      return;
    }

    const ids = completedTodos.map(t => t.id);

    setLoadingIds(prev => [...prev, ...ids]);

    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodo(todo.id).then(() => todo.id)),
      );

      const successIds = results
        .filter(r => r.status === 'fulfilled')
        .map(r => (r as PromiseFulfilledResult<number>).value);

      setTodos(prev => prev.filter(todo => !successIds.includes(todo.id)));

      if (results.some(r => r.status === 'rejected')) {
        showError(ErrorMessage.DELETE);
      }
    } finally {
      setLoadingIds(prev => prev.filter(id => !ids.includes(id)));
      inputRef.current?.focus(); // используем корректный ref
    }
  };

  const hasTodos = todos.length > 0;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          onTitleChange={setTitle}
          onSubmit={handleSubmit}
          inputRef={inputRef}
          disabled={isSubmitting}
        />

        {hasTodos && (
          <TodoList
            todos={visibleTodos}
            loadingIds={loadingIds}
            onToggle={toggleTodo}
            onDelete={handleDelete}
          />
        )}
        {tempTodo && <TempTodoItem tempTodo={tempTodo} />}

        {hasTodos && (
          <Footer
            filter={filter}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={hideError} />
    </div>
  );
};
