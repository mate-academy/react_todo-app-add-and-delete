import React, { useCallback, useEffect, useState } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterBy } from './types/FilterBy';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { Errors } from './types/Errors';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [statusFilterTodo, setStatusFilterTodo] = useState(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.None);
  const [isLoading, setIsLoading] = useState(false);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const clearError = useCallback(() => {
    setErrorMessage(Errors.None);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.Load);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const displayedTodos = [...todos];

  const todoFilter = displayedTodos.filter(todo => {
    switch (statusFilterTodo) {
      case FilterBy.All:
        return true;
      case FilterBy.Active:
        return !todo.completed;
      case FilterBy.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleAddTodo = async (title: string) => {
    if (!title.trim()) {
      setErrorMessage(Errors.EmptyTitle);

      return;
    }

    const newTodoToAdd: Todo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
      id: 0,
    };

    setTempTodo(newTodoToAdd);
    setErrorMessage(Errors.None);

    return addTodo(newTodoToAdd)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage(Errors.Add);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleToggle = async (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );

    try {
      await updateTodo(id, !todos.find(todo => todo.id === id)?.completed);
    } catch {
      setErrorMessage(Errors.Update);
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, completed: todo.completed } : todo,
        ),
      );
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletedIds(prevIds => [...prevIds, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(Errors.Delete);
    } finally {
      setDeletedIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const handleAllToggle = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(todo => todo.completed === allCompleted);

    setTodos(prevTodos =>
      prevTodos.map(todo => ({
        ...todo,
        completed: !allCompleted,
      })),
    );

    try {
      await Promise.all(
        todosToUpdate.map(todo => updateTodo(todo.id, !allCompleted)),
      );
    } catch {
      setErrorMessage(Errors.Update);
    }
  };

  const handleClearTodo = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setIsLoading(true);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const failedIds = completedTodos
      .filter((_, i) => results[i].status === 'rejected')
      .map(todo => todo.id);

    setTodos(prevTodos =>
      prevTodos.filter(todo => !todo.completed || failedIds.includes(todo.id)),
    );

    if (failedIds.length > 0) {
      setErrorMessage(Errors.Delete);
    }

    setIsLoading(false);
  };

  const todosCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          tempTodo={tempTodo}
          handleAllToggle={handleAllToggle}
          handleAddTodo={handleAddTodo}
          isLoading={isLoading}
        />
        <TodoList
          todoFilter={todoFilter}
          tempTodo={tempTodo}
          handleToggle={handleToggle}
          handleDeleteTodo={handleDeleteTodo}
          deletedIds={deletedIds}
        />
        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            statusFilterTodo={statusFilterTodo}
            setStatusFilterTodo={setStatusFilterTodo}
            handleClearTodo={handleClearTodo}
            activeTodosCount={todosCount}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} clearError={clearError} />
    </div>
  );
};
