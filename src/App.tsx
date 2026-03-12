/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, postTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter, FilterStatus } from './components/TodoFooter';

export const App: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = React.useState<number[]>([]);
  const [isAdding, setIsAdding] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<ErrorMessage | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>(
    FilterStatus.All,
  );

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.UnableToLoad))
      .finally(() => setLoading(false));
  }, []);

  const onAddTodo = useCallback(async (title: string) => {
    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);
    setIsAdding(true);

    try {
      const addedTodo = await postTodo(trimmedTitle, USER_ID);

      setTodos(prevTodos => [...prevTodos, addedTodo]);
      setTempTodo(null);
    } catch {
      setError(ErrorMessage.UnableToAdd);
      setTempTodo(null);
    } finally {
      setIsAdding(false);
    }
  }, []);

  const onDeleteTodo = useCallback(async (id: number) => {
    setDeletingTodoIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      setError(ErrorMessage.UnableToDelete);
    } finally {
      setDeletingTodoIds(prev => prev.filter(todoId => todoId !== id));
    }
  }, []);

  const onClearCompleted = useCallback(async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setDeletingTodoIds(prev => [
      ...prev,
      ...completedTodos.map(todo => todo.id),
    ]);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successfulIds = completedTodos
      .filter((_, index) => results[index].status === 'fulfilled')
      .map(todo => todo.id);

    if (successfulIds.length < completedTodos.length) {
      setError(ErrorMessage.UnableToDelete);
    }

    setTodos(prevTodos =>
      prevTodos.filter(todo => !successfulIds.includes(todo.id)),
    );
    setDeletingTodoIds([]);
  }, [todos]);

  // Auto-hide error notification after 3 seconds
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const filteredTodos = useMemo(() => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return todos.filter(todo => !todo.completed);
      case FilterStatus.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterStatus]);

  const { activeTodosCount, completedTodosCount } = useMemo(() => {
    let active = 0;
    let completed = 0;

    for (const todo of todos) {
      if (todo.completed) {
        completed++;
      } else {
        active++;
      }
    }

    return { activeTodosCount: active, completedTodosCount: completed };
  }, [todos]);

  const allCompleted = todos.length > 0 && activeTodosCount === 0;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          allCompleted={allCompleted}
          onAddTodo={onAddTodo}
          isAdding={isAdding}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            deletingTodoIds={deletingTodoIds}
            onDeleteTodo={onDeleteTodo}
          />
        )}

        {loading && (
          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}

        {tempTodo && (
          <TodoList
            todos={[tempTodo]}
            deletingTodoIds={deletingTodoIds}
            onDeleteTodo={onDeleteTodo}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            onClearCompleted={onClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} onClose={() => setError(null)} />
    </div>
  );
};
