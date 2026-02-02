/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useRef,
  FormEvent,
  useMemo,
  useCallback,
} from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { ErrorMessage } from './types/AppError';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.Default);
  const [filter, setFilter] = useState<Filter>(Filter.All);

  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(true);

    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setError(ErrorMessage.LoadTodos);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [todos.length, isAdding]);

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.TitleEmpty);

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    setIsAdding(true);

    addTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(currentTodo => [...currentTodo, newTodo]);
        setTempTodo(null);
        setTitle('');
        setError(ErrorMessage.Default);
      })
      .catch(() => {
        setError(ErrorMessage.AddTodo);
        setTempTodo(null);
      })
      .finally(() => {
        setIsAdding(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodoId(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(ErrorMessage.DeleteTodo);
      })
      .finally(() => {
        setDeletingTodoId(null);
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.filter(todoItem => todoItem.id !== todo.id),
          );
        })
        .catch(() => {
          setError(ErrorMessage.DeleteTodo);
        }),
    );
  };

  const handleFilterChange = useCallback((filterStatus: Filter) => {
    setFilter(filterStatus);
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (error === ErrorMessage.TitleEmpty) {
      setError(ErrorMessage.Default);
    }
  };

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const hasTodos = Boolean(todos.length);
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onTitleChange={handleTitleChange}
          title={title}
          inputRef={inputRef}
          onSubmit={handleAddTodo}
          disabled={isAdding}
        />

        {!isLoading && hasTodos && (
          <TodoList
            todos={visibleTodos}
            onDelete={handleDeleteTodo}
            deletingTodoId={deletingTodoId}
          />
        )}

        {tempTodo && <TodoItem todo={tempTodo} loading={true} />}

        {/* overlay will cover the todo while it is being deleted or updated */}

        {hasTodos && (
          <Footer
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            setFilter={handleFilterChange}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        error={error}
        onClose={() => setError(ErrorMessage.Default)}
      />
    </div>
  );
};
