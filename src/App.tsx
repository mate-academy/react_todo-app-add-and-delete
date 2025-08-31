/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Loader } from './components/Loader';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempoTodo, setTempoTodo] = useState<Todo | null>(null);
  const [IdToDelete, setIdToDelete] = useState<number[]>([]);

  useEffect(() => {
    inputRef.current?.focus();
    setError('');
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let timeoutId: number;

    if (error?.length) {
      timeoutId = window.setTimeout(() => setError(null), 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [error]);

  const addNewTodo = async (title: string) => {
    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    setTempoTodo({
      id: 0,
      title: title,
      completed: false,
      userId: USER_ID,
    });

    try {
      const createdTodo = await addTodo(title);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTempoTodo(null);

      return true;
    } catch {
      setError('Unable to add a todo');
      setTempoTodo(null);

      return false;
    } finally {
      if (inputRef.current) {
        inputRef.current.disabled = false;
      }
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setIdToDelete(prev => [...prev, id]);

    try {
      await deleteTodo(id);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setIdToDelete([]);
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setIdToDelete(completedTodos.map(todo => todo.id));

    try {
      await Promise.all(
        completedTodos.map(async todo => {
          try {
            await deleteTodo(todo.id);
            setTodos(prev => prev.filter(currTodo => todo.id !== currTodo.id));
          } catch {
            setError('Unable to delete a todo');
          }
        }),
      );
    } finally {
      setIdToDelete([]);
      inputRef.current?.focus();
    }
  };

  const filteredTodos = useMemo(
    () =>
      todos.filter(todo => {
        switch (filter) {
          case FilterType.Active:
            return !todo.completed;
          case FilterType.Completed:
            return todo.completed;
          default:
            return true;
        }
      }),
    [todos, filter],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          inputRef={inputRef}
          setError={setError}
          onAdd={addNewTodo}
          error={error}
        />
        {isLoading && <Loader isLoading={isLoading} />}
        <TodoList
          todos={filteredTodos}
          onDelete={handleDeleteTodo}
          idToDelete={IdToDelete}
        />
        {tempoTodo && (
          <TodoItem
            todo={tempoTodo}
            isTodoTemp={true}
            onDelete={handleDeleteTodo}
            idToDelete={IdToDelete}
          />
        )}
        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification error={error} />
    </div>
  );
};
