/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<FilterStatus>('all');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [title, setTitle] = useState<string>('');
  const [isAddingTodo, setIsAddingTodo] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeLoaderIds, setActiveLoaderIds] = useState<number[]>([]);

  const inRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsAddingTodo(true);
    setErrorMessage('');

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);

    addTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    })
      .then(createdTodo => {
        setTodos(prevTodos => [...prevTodos, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsAddingTodo(false);
        setTimeout(() => {
          inRef.current?.focus();
        }, 0);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setErrorMessage('');
    setActiveLoaderIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setActiveLoaderIds(prev => prev.filter(id => id !== todoId));
        inRef.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    setErrorMessage('');
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setActiveLoaderIds(prev => [...prev, ...completedIds]);

    const deleteRequests = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        })
        .finally(() => {
          setActiveLoaderIds(prev => prev.filter(id => id !== todo.id));
        }),
    );

    Promise.allSettled(deleteRequests).finally(() => {
      inRef.current?.focus();
    });
  };

  const visibleTodos = todos.filter(todo => {
    if (status === 'active') {
      return !todo.completed;
    }

    if (status === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              ref={inRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              disabled={isAddingTodo}
              onChange={e => setTitle(e.target.value)}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              activeLoaderIds={activeLoaderIds}
              onDeleteTodo={handleDeleteTodo}
            />
            <Footer
              activeTodosCount={activeTodosCount}
              hasCompletedTodos={hasCompletedTodos}
              status={status}
              onStatusChange={setStatus}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
