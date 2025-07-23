import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterBy } from './types/FilterBy';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingItemIds, setLoadingItemIds] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.Empty,
  );
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);

  const { visibleTodos, activeTodosAmount } = useMemo(() => {
    const active = todos.filter(todo => !todo.completed);
    return {
      visibleTodos:
        filterBy === FilterBy.All
          ? todos
          : filterBy === FilterBy.Active
          ? active
          : todos.filter(todo => todo.completed),
      activeTodosAmount: active.length,
    };
  }, [todos, filterBy]);

  const focusInput = useCallback(() => {
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const hideError = useCallback(() => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
    setErrorMessage(ErrorMessage.Empty);
  }, []);

  const showError = useCallback((message: ErrorMessage) => {
    setErrorMessage(message);
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }
    errorTimerRef.current = setTimeout(() => {
      setErrorMessage(ErrorMessage.Empty);
      errorTimerRef.current = null;
    }, 3000);
  }, []);

  const loadTodos = useCallback(() => {
    setErrorMessage(ErrorMessage.Empty);
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load))
      .finally(() => setTempTodo(null));
  }, [showError]);

  const finalizeAction = useCallback((idsToRemove: number[] = []) => {
    setLoadingItemIds(prev =>
      prev.filter(id => !idsToRemove.includes(id)),
    );
    focusInput();
  }, [focusInput]);

  const createTodo = useCallback((trimmedTitle: string) => {
    const newTodo: Todo = {
      id: 0,
      userId: todoService.USER_ID,
      title: trimmedTitle,
      completed: false,
    };
    setTempTodo(newTodo);
    setLoadingItemIds(prev => [...prev, 0]);

    todoService
      .createTodo({
        title: trimmedTitle,
        completed: false,
        userId: todoService.USER_ID,
      })
      .then(newTodoFromServer => {
        setTodos(prev => [...prev, newTodoFromServer]);
        setTitle('');
      })
      .catch(() => showError(ErrorMessage.Create))
      .finally(() => {
        setTempTodo(null);
        finalizeAction([0]);
      });
  }, [showError, finalizeAction]);

  const deleteTodo = useCallback((id: number) => {
    setErrorMessage(ErrorMessage.Empty);
    setLoadingItemIds(prev => [...prev, id]);

    todoService
      .deleteTodo(id)
      .then(() => setTodos(prev => prev.filter(t => t.id !== id)))
      .catch(() => showError(ErrorMessage.Delete))
      .finally(() => finalizeAction([id]));
  }, [showError, finalizeAction]);

  const clearCompletedTodos = useCallback(async () => {
    const completed = todos.filter(t => t.completed);
    if (!completed.length) return;

    setErrorMessage(ErrorMessage.Empty);
    setLoadingItemIds(prev => [...prev, ...completed.map(t => t.id)]);

    try {
      const results = await Promise.allSettled(
        completed.map(t => todoService.deleteTodo(t.id)),
      );
      const successful = completed
        .filter((_, i) => results[i].status === 'fulfilled')
        .map(t => t.id);

      setTodos(prev => prev.filter(t => !successful.includes(t.id)));

      if (results.some(r => r.status === 'rejected')) {
        showError(ErrorMessage.Delete);
      }
    } finally {
      setLoadingItemIds([]);
      focusInput();
    }
  }, [todos, showError, focusInput]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        showError(ErrorMessage.TitleValidation);
        return;
      }
      createTodo(trimmedTitle);
    },
    [title, createTodo, showError],
  );

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={title}
          onTitleChange={setTitle}
          loadingItemIds={loadingItemIds}
          handleSubmit={handleSubmit}
          inputRef={inputRef}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingItemIds={loadingItemIds}
          handleDelete={deleteTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            activeTodosAmount={activeTodosAmount}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            onClearCompleted={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} hideError={hideError} />
    </div>
  );
};
