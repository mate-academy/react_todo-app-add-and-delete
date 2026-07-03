/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { FilterType } from './types/Filter';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

const USER_ID = 2425;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [focusTrigger, setFocusTrigger] = useState(0);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      case 'all':
      default:
        return true;
    }
  });

  const handleAddTodo = (title: string, onSuccess: () => void) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      flushSync(() => {
        setErrorMessage('Title should not be empty');
      });

      return;
    }

    flushSync(() => {
      setErrorMessage(null);
      setIsAdding(true);
    });

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    flushSync(() => {
      setTempTodo(temp);
    });

    createTodo({
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        onSuccess();
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        flushSync(() => {
          setTempTodo(null);
          setIsAdding(false);
          setFocusTrigger(prev => prev + 1);
        });
      });
  };

  const handleDeleteTodo = (id: number) => {
    flushSync(() => {
      setErrorMessage(null);
      setDeletingIds(prev => [...prev, id]);
    });

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        flushSync(() => {
          setDeletingIds(prev => prev.filter(dId => dId !== id));
          setFocusTrigger(prev => prev + 1);
        });
      });
  };

  const handleClearCompleted = () => {
    flushSync(() => {
      setErrorMessage(null);
      completedTodos.forEach(todo => {
        setDeletingIds(prev => [...prev, todo.id]);
      });
    });

    const promises = completedTodos.map(todo => {
      return deleteTodo(todo.id)
        .then(() => {
          setTodos(prev => prev.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        })
        .finally(() => {
          flushSync(() => {
            setDeletingIds(prev => prev.filter(dId => dId !== todo.id));
          });
        });
    });

    Promise.all(promises).finally(() => {
      flushSync(() => {
        setFocusTrigger(prev => prev + 1);
      });
    });
  };

  const isAllCompleted = todos.length > 0 && todos.every(t => t.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasTodos={todos.length > 0}
          isAllCompleted={isAllCompleted}
          isAdding={isAdding}
          onAddTodo={handleAddTodo}
          focusTrigger={focusTrigger}
        />

        {(todos.length > 0 || tempTodo !== null) && (
          <TodoList
            todos={visibleTodos}
            deletingIds={deletingIds}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeTodos.length}
            completedCount={completedTodos.length}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
