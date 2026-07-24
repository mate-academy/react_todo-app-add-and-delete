/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo, FilterType } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);

  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterType.Active) {
      return !todo.completed;
    }

    if (filter === FilterType.Completed) {
      return todo.completed;
    }

    return true;
  });

  const todosToRender = tempTodo ? [...visibleTodos, tempTodo] : visibleTodos;

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);
  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const handleAddTodo = async (title: string) => {
    setErrorMessage('');
    setIsAdding(true);

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setLoadingTodoIds(prev => [...prev, 0]);

    try {
      const createdTodo = await createTodo({
        title,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch (error) {
      setErrorMessage(ErrorMessage.Add);
      throw error;
    } finally {
      setTempTodo(null);
      setLoadingTodoIds(prev => prev.filter(id => id !== 0));
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setErrorMessage('');
    setLoadingTodoIds(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      newTodoFieldRef.current?.focus();
    } catch {
      setErrorMessage(ErrorMessage.Delete);
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    setErrorMessage('');

    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(prev => [...prev, ...completedIds]);

    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodo(todo.id)),
      );

      const deletedIds = completedTodos
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      setTodos(prevTodos =>
        prevTodos.filter(todo => !deletedIds.includes(todo.id)),
      );

      const hasError = results.some(result => result.status === 'rejected');

      if (hasError) {
        setErrorMessage(ErrorMessage.Delete);
      }
    } catch {
      setErrorMessage(ErrorMessage.Delete);
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => !completedIds.includes(id)));
      newTodoFieldRef.current?.focus();
    }
  };

  const handleToggleTodo = async (todoToUpdate: Todo) => {
    setErrorMessage('');
    setLoadingTodoIds(prev => [...prev, todoToUpdate.id]);

    try {
      const updatedTodo = await updateTodo({
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
      });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    } catch {
      setErrorMessage(ErrorMessage.Update);
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoToUpdate.id));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosCount={todos.length}
          isAllCompleted={isAllCompleted}
          onAddTodo={handleAddTodo}
          isDisabled={isAdding}
          onError={setErrorMessage}
          loadingTodoIds={loadingTodoIds}
          inputRef={newTodoFieldRef}
        />

        {todos.length > 0 && (
          <TodoList
            todos={todosToRender}
            onDelete={handleDeleteTodo}
            loadingTodoIds={loadingTodoIds}
            onToggle={handleToggleTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            hasCompleted={hasCompleted}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
