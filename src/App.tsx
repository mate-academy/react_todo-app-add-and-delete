/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  USER_ID,
  createTodo,
  deleteTodos,
  deleteCompletedTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Error } from './types/Error';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputDisabled]);

  useEffect(() => {
    setError(null);
    getTodos()
      .then(result => {
        setTodos(result);
      })
      .catch(() => setError(Error.Load_todos))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(null), 3000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

  const addTodo = ({ title: todoTitle, userId, completed }: Todo) => {
    const trimmedTitle = todoTitle.trim();

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    });
    setIsInputDisabled(true);

    createTodo({ title: trimmedTitle, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        setTitle('');
        inputRef.current?.focus();
      })
      .catch(() => {
        setError(Error.Add_todo);
        setTempTodo(null);
      })
      .finally(() => setIsInputDisabled(false));
  };

  const deleteTodo = (id: number) => {
    setIsInputDisabled(true);
    setDeletedIds(prev => [...prev, id]);
    deleteTodos(id)
      .then(() => {
        setTodos(current => current.filter(t => t.id !== id));
      })
      .catch(() => {
        setError(Error.Delete_todo);
      })
      .finally(() => {
        setDeletedIds(prev => prev.filter(d => d !== id));
        setIsInputDisabled(false);
      });
  };

  const deleteAllCompleted = (completedTodos: Todo[]) => {
    const idsToDelete = completedTodos.map(t => t.id);

    setDeletedIds(idsToDelete);
    setIsInputDisabled(true);
    deleteCompletedTodos(idsToDelete)
      .then(results => {
        const fulfilledIds = results
          .map((r, i) =>
            r.status === 'fulfilled' && r.value === 1 ? idsToDelete[i] : null,
          )
          .filter((id): id is number => id !== null);

        const hasRejected = results.some(r => r.status === 'rejected');

        setTodos(current =>
          current.filter(todo => !fulfilledIds.includes(todo.id)),
        );

        if (hasRejected) {
          setError(Error.Delete_todo);
        }
      })
      .catch(() => {
        setError(Error.Delete_todo);
      })
      .finally(() => {
        setDeletedIds([]);
        setIsInputDisabled(false);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!title.trim()) {
        setError(Error.Empty_title);

        return;
      }

      addTodo({ title, userId: USER_ID, completed: false });
    }
  };

  const handleCompletedChange = (id: number) => {
    setTodos(current =>
      current.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          inputRef={inputRef}
          title={title}
          handleKeyDown={handleKeyDown}
          handleTitleChange={handleTitleChange}
          isInputDisabled={isInputDisabled}
        />

        {!isLoading && (todos.length > 0 || tempTodo) && (
          <TodoList
            todos={todos}
            filter={filter}
            handleCompletedChange={handleCompletedChange}
            tempTodo={tempTodo}
            deleteTodo={deleteTodo}
            deletedIds={deletedIds}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            deleteAllCompleted={deleteAllCompleted}
            isInputDisabled={isInputDisabled}
          />
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
