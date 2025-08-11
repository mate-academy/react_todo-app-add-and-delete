/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

type FilterStatus = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      setErrorMessage(null);
      try {
        const userTodos = await client.get<Todo[]>(`/todos?userId=${USER_ID}`);

        setTodos(userTodos);
      } catch (error) {
        setErrorMessage('Unable to load todos');
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timerId = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timerId);
    }

    return undefined;
  }, [errorMessage]);

  useEffect(() => {
    if (newTodoFieldRef.current) {
      newTodoFieldRef.current.focus();
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      case 'all':
      default:
        return true;
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage(null);
    setIsAddingTodo(true);

    const tempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTodos(currentTodos => [...currentTodos, tempTodo]);
    setLoadingTodoIds(currentIds => [...currentIds, tempTodo.id]);

    try {
      const newTodo = await client.post<Todo>('/todos', {
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === tempTodo.id ? newTodo : todo)),
      );
      setNewTodoTitle('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTodos(currentTodos =>
        currentTodos.filter(todo => todo.id !== tempTodo.id),
      );
    } finally {
      setIsAddingTodo(false);
      setLoadingTodoIds(currentIds =>
        currentIds.filter(id => id !== tempTodo.id),
      );

      setTimeout(() => {
        if (newTodoFieldRef.current) {
          newTodoFieldRef.current.focus();
        }
      }, 0);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setErrorMessage(null);
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    try {
      await client.delete(`/todos/${todoId}`);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));

      setTimeout(() => {
        if (newTodoFieldRef.current) {
          newTodoFieldRef.current.focus();
        }
      }, 0);
    }
  };

  const handleToggleTodoStatus = async (
    todoId: number,
    currentStatus: boolean,
  ) => {
    setErrorMessage(null);
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    try {
      const updatedTodo = await client.patch<Todo>(`/todos/${todoId}`, {
        completed: !currentStatus,
      });

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch (error) {
      setErrorMessage('Unable to update todo');
    } finally {
      setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
    }
  };

  const areAllTodosCompleted = todos.every(todo => todo.completed);

  const handleToggleAllTodos = async () => {
    setErrorMessage(null);

    const targetStatus = !areAllTodosCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    setLoadingTodoIds(currentIds => [
      ...currentIds,
      ...todosToUpdate.map(todo => todo.id),
    ]);

    try {
      const updatePromises = todosToUpdate.map(todo =>
        client.patch<Todo>(`/todos/${todo.id}`, { completed: targetStatus }),
      );

      const updatedTodos = await Promise.all(updatePromises);

      setTodos(currentTodos =>
        currentTodos.map(todo => {
          const updated = updatedTodos.find(ut => ut.id === todo.id);

          return updated || todo;
        }),
      );
    } catch (error) {
      setErrorMessage('Unable to update todos');
    } finally {
      setLoadingTodoIds(currentIds =>
        currentIds.filter(id => !todosToUpdate.some(todo => todo.id === id)),
      );
    }
  };

  const handleClearCompleted = async () => {
    setErrorMessage(null);

    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setLoadingTodoIds(currentIds => [
      ...currentIds,
      ...completedTodos.map(todo => todo.id),
    ]);

    const deletePromises = completedTodos.map(todo =>
      client.delete(`/todos/${todo.id}`).then(
        () => ({ status: 'fulfilled', todoId: todo.id }),
        () => ({ status: 'rejected', todoId: todo.id }),
      ),
    );

    const results = await Promise.all(deletePromises);

    const successfulDeletions = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.todoId);

    const failedDeletions = results
      .filter(result => result.status === 'rejected')
      .map(result => result.todoId);

    if (successfulDeletions.length > 0) {
      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulDeletions.includes(todo.id)),
      );
    }

    if (failedDeletions.length > 0) {
      setErrorMessage('Unable to delete a todo');
    }

    setLoadingTodoIds(currentIds =>
      currentIds.filter(id => !completedTodos.some(todo => todo.id === id)),
    );

    setTimeout(() => {
      if (newTodoFieldRef.current) {
        newTodoFieldRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          areAllTodosCompleted={areAllTodosCompleted}
          handleToggleAllTodos={handleToggleAllTodos}
          handleSubmit={handleSubmit}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          isAddingTodo={isAddingTodo}
          newTodoFieldRef={newTodoFieldRef}
        />

        {todos.length > 0 && (
          <TodoList
            filteredTodos={filteredTodos}
            handleToggleTodoStatus={handleToggleTodoStatus}
            handleDeleteTodo={handleDeleteTodo}
            loadingTodoIds={loadingTodoIds}
            isAddingTodo={isAddingTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            loadingTodoIds={loadingTodoIds}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
