import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { NewTodo } from './components/NewTodo';
import { FilterStatus } from './types/FilterStatus';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleCloseError = () => {
    setErrorMessage('');
  };

  const handleFilterChange = (newFilter: FilterStatus) => {
    setFilter(newFilter);
  };

  const handleAddTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsAdding(true);
    setErrorMessage('');

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    try {
      const createdTodo = await client.post<Todo>('/todos', {
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prev => [...prev, createdTodo]);
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingIds(prev => [...prev, todoId]);
    setErrorMessage('');

    try {
      await client.delete(`/todos/${todoId}`);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setDeletingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setDeletingIds(completedTodos.map(todo => todo.id));
    setErrorMessage('');

    const deletePromises = completedTodos.map(todo =>
      client
        .delete(`/todos/${todo.id}`)
        .then(() => ({ success: true, id: todo.id }))
        .catch(() => ({ success: false, id: todo.id })),
    );

    const results = await Promise.all(deletePromises);

    const successfulIds = results
      .filter(result => result.success)
      .map(result => result.id);

    const hasErrors = results.some(result => !result.success);

    if (successfulIds.length > 0) {
      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));
    }

    if (hasErrors) {
      setErrorMessage('Unable to delete a todo');
    }

    setDeletingIds([]);
  };

  const getFilteredTodos = (): Todo[] => {
    switch (filter) {
      case FilterStatus.Active:
        return todos.filter(todo => !todo.completed);
      case FilterStatus.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasTodos = todos.length > 0;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo onAdd={handleAddTodo} disabled={isAdding} />

        {(hasTodos || tempTodo) && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
            deletingIds={deletingIds}
          />
        )}

        {hasTodos && (
          <Footer
            activeTodosCount={activeTodosCount}
            currentFilter={filter}
            onFilterChange={handleFilterChange}
            onClearCompleted={handleClearCompleted}
            hasCompletedTodos={hasCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification message={errorMessage} onClose={handleCloseError} />
    </div>
  );
};
