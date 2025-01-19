import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { getTodos, createTodo, deleteTodo, updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const userId = 1878;

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddTodo = async (title: string): Promise<void> => {
    if (!title.trim()) {
      setError('Title should not be empty');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      const createdTodo = await createTodo(newTodo);
      setTodos(prevTodos => [...prevTodos, createdTodo]);
      setTempTodo(null);
    } catch {
      setError('Unable to add a todo');
      setTempTodo(null);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteTodo = async (todoId: number): Promise<void> => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleUpdateTodo = async (
    todoId: number,
    updates: Partial<Todo>
  ): Promise<void> => {
    try {
      const updatedTodo = await updateTodo(todoId, updates);
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        )
      );
    } catch {
      setError('Unable to update a todo');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleMarkAllAsCompleted = (): void => {
    setTodos(prevTodos =>
      prevTodos.map(todo => ({ ...todo, completed: true }))
    );
  };

  const clearCompleted = async (): Promise<void> => {
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      await Promise.all(
        completedTodos.map(todo =>
          deleteTodo(todo.id).catch(() =>
            setError('Unable to delete some todos')
          )
        )
      );
      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch {
      setError('Error clearing completed todos');
      setTimeout(() => setError(''), 3000);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!userId) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {isLoading && (
        <div className="todo-loader" data-cy="TodoLoader">
          <span>Loading...</span>
        </div>
      )}

      {error && (
        <div
          className={classNames(
            'notification',
            'is-danger',
            'is-light'
          )}
          data-cy="ErrorNotification"
        >
          <button
            type="button"
            className="delete"
            onClick={() => setError('')}
            data-cy="HideErrorButton"
          />
          {error}
        </div>
      )}

      {!isLoading && (
        <>
          <Header
            onAddTodo={handleAddTodo}
            onMarkAllAsCompleted={handleMarkAllAsCompleted}
          />
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDeleteTodo={handleDeleteTodo}
            onUpdateTodo={handleUpdateTodo}
            loadingTodoIds={loadingTodoIds}
          />
          {todos.length > 0 && (
            <Footer
              filter={filter}
              setFilter={setFilter}
              todosCount={todos.filter(todo => !todo.completed).length}
              clearCompleted={clearCompleted}
            />
          )}
        </>
      )}
    </div>
  );
};
