/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';

import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';

import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotif/ErrorNotification';
import { TodoList } from './components/TodoList/TodoList';

import { ErrorMessage } from './enums/ErrorMessage';
import { Filter } from './enums/Filter';

import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [isAdding, setIsAdding] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const loadTodos = async () => {
    try {
      setError('');

      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch {
      setError(ErrorMessage.Load);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const visibleTodos = useMemo(() => {
    let filteredTodos = [...todos];

    if (filter === Filter.Active) {
      filteredTodos = filteredTodos.filter(todo => {
        return !todo.completed;
      });
    }

    if (filter === Filter.Completed) {
      filteredTodos = filteredTodos.filter(todo => {
        return todo.completed;
      });
    }

    return filteredTodos;
  }, [todos, filter]);

  const activeCount = todos.filter(todo => {
    return !todo.completed;
  }).length;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setError('');
    setIsAdding(true);

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    try {
      const createdTodo = await addTodo(newTodo);

      setTodos(currentTodos => {
        return [...currentTodos, createdTodo];
      });

      setTitle('');
    } catch {
      setError(ErrorMessage.Add);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDelete = async (todoId: number) => {
    setProcessingIds(currentIds => {
      return [...currentIds, todoId];
    });

    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => {
        return currentTodos.filter(todo => {
          return todo.id !== todoId;
        });
      });

      inputRef.current?.focus();
    } catch {
      setError(ErrorMessage.Delete);
    } finally {
      setProcessingIds(currentIds => {
        return currentIds.filter(id => {
          return id !== todoId;
        });
      });
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => {
      return todo.completed;
    });

    await Promise.allSettled(
      completedTodos.map(async todo => {
        setProcessingIds(currentIds => {
          return [...currentIds, todo.id];
        });

        try {
          await deleteTodo(todo.id);

          setTodos(currentTodos => {
            return currentTodos.filter(currentTodo => {
              return currentTodo.id !== todo.id;
            });
          });
        } catch {
          setError(ErrorMessage.Delete);
        } finally {
          setProcessingIds(currentIds => {
            return currentIds.filter(id => {
              return id !== todo.id;
            });
          });
        }
      }),
    );

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
          title={title}
          onChange={setTitle}
          onSubmit={handleSubmit}
          disabled={isAdding}
          inputRef={inputRef}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          processingIds={processingIds}
          onDelete={handleDelete}
          onToggle={() => {}}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            activeCount={activeCount}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError('')} />
    </div>
  );
};
