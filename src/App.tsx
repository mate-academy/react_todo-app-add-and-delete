/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterType } from './types/FilterType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    const loadTodos = async (): Promise<void> => {
      setError(null);
      setIsLoading(true);
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch {
        setError('Unable to load todos');
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  const handleAddTodo = async (title: string, focusInput: () => void) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      focusInput();

      return;
    }

    setIsLoading(true);

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
      isLoading: true,
    };

    setTempTodo(newTodo);

    try {
      const createdTodo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(prevTodos => [...prevTodos, createdTodo]);
      setNewTodoTitle('');
      focusInput();
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === todoId ? { ...todo, isDeleting: true } : todo,
      ),
    );

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } catch {
      setError('Unable to delete a todo');
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, isDeleting: false } : todo,
        ),
      );
    }
  };

  const clearCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodo(todo.id)),
      );

      results.forEach(result => {
        if (result.status === 'rejected') {
          setError('Unable to delete a todo');
        }
      });

      setTodos(prevTodos =>
        prevTodos.filter(
          todo =>
            !completedTodos.some(
              completedTodo =>
                completedTodo.id === todo.id &&
                results[completedTodos.indexOf(completedTodo)].status ===
                  'fulfilled',
            ),
        ),
      );

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (errorMessage) {
      setError('Unable to delete a todo');
    }
  };

  const handleFormSubmit = async (
    event: React.FormEvent,
    focusInput: () => void,
  ) => {
    event.preventDefault();
    await handleAddTodo(newTodoTitle, focusInput);
  };

  const toggleTodo = (todoId: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterType.Active) {
      return !todo.completed;
    }

    if (filter === FilterType.Completed) {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      {!USER_ID ? (
        <UserWarning />
      ) : (
        <>
          <h1 className="todoapp__title">todos</h1>
          <div className="todoapp__content">
            <Header
              newTodoTitle={newTodoTitle}
              setNewTodoTitle={setNewTodoTitle}
              handleAddTodo={handleFormSubmit}
              isLoading={isLoading}
              todos={todos}
              inputRef={inputRef}
            />

            <TodoList
              todos={filteredTodos}
              isLoading={isLoading}
              tempTodo={tempTodo}
              handleDeleteTodo={handleDeleteTodo}
              onToggle={toggleTodo}
            />

            {todos.length > 0 && (
              <Footer
                todos={todos}
                handleClearCompleted={clearCompletedTodos}
                filter={filter}
                setFilter={setFilter}
              />
            )}
          </div>

          <ErrorNotification error={error} setError={setError} />
        </>
      )}
    </div>
  );
};
