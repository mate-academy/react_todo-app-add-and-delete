/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import {
  deleteTodoApi,
  getTodos,
  USER_ID,
  addTodo,
  toggleTodo,
} from './api/todos';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import { Error } from './ErrorNotification';
import { TodoForm } from './TodoForm';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { FilterEnum } from './types/filterEnum';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterEnum>(FilterEnum.All);
  const [loadingTodo, setLoadingTodo] = useState<number | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const focusInput = () => {
    const inputElement = document.querySelector<HTMLInputElement>(
      'input.todoapp__new-todo',
    );

    inputElement?.focus();
  };

  useEffect(() => {
    if (!USER_ID) {
      setErrorMessage('USER_ID is not set');

      return;
    }

    getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        setErrorMessage(null);
        focusInput();
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const handleAddTodo = async (
    title: string,
    setIsSubmitting: (value: boolean) => void,
    resetForm: () => void,
  ): Promise<void> => {
    const newtempTodo: Todo = {
      id: Date.now(),
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newtempTodo);

    try {
      const newTodo = await addTodo(title);

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setTempTodo(null);
      resetForm();
      setErrorMessage(null);
    } catch {
      setErrorMessage('Unable to add a todo');
      setTempTodo(null);
    } finally {
      setLoadingTodo(null);
      setIsSubmitting(false);
      focusInput();
    }
  };

  const handleToggleTodo = async (id: number) => {
    try {
      setLoadingTodo(id);
      const toggledTodo = await toggleTodo(todos.find(todo => todo.id === id)!);

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? toggledTodo : todo)),
      );
      setErrorMessage(null);
    } catch {
      setErrorMessage('Unable to toggle todo');
    } finally {
      setLoadingTodo(null);
      focusInput();
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setLoadingIds(completedTodos.map(todo => todo.id));

    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodoApi(todo.id)),
      );

      const successfullyDeletedIds = completedTodos
        .map((todo, index) =>
          results[index].status === 'fulfilled' ? todo.id : null,
        )
        .filter((id): id is number => id !== null);

      setTodos(prevTodos =>
        prevTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
      );

      if (results.some(result => result.status === 'rejected')) {
        setErrorMessage('Unable to delete a todo');
      } else {
        setErrorMessage(null);
      }
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingIds([]);
      focusInput();
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FilterEnum.Active:
        return !todo.completed;
      case FilterEnum.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleDeleteTodo = async (id: number) => {
    setLoadingIds(prev => [...prev, id]);
    try {
      setLoadingTodo(id);
      await deleteTodoApi(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingIds(prev => prev.filter(loadingId => loadingId !== id));
      setLoadingTodo(null);
      focusInput();
    }
  };

  const handleErrorClose = () => {
    setErrorMessage(null);
    focusInput();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoForm onAddTodo={handleAddTodo} setErrorMessage={setErrorMessage} />

      <div className="todo__content">
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDeleteTodo={handleDeleteTodo}
          onToggleTodo={handleToggleTodo}
          loadingIds={loadingIds}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
            loadingTodo={loadingTodo}
          />
        )}
      </div>

      {!USER_ID && <UserWarning />}

      <Error errorMessage={errorMessage} setErrorMessage={handleErrorClose} />
    </div>
  );
};
