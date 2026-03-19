/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { getTodos, addTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus, ErrorMessage } from './types/enums';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState<FilterStatus>(FilterStatus.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);
  const deletingIdsSet = useMemo(() => new Set(deletingIds), [deletingIds]);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LoadTodos);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (!isAdding && deletingIds.length === 0) {
      newTodoFieldRef.current?.focus();
    }
  }, [isAdding, deletingIds.length]);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setIsAdding(true);
    setTempTodo(newTempTodo);

    try {
      const createdTodo = await addTodo(USER_ID, trimmedTitle);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTitle('');
    } catch {
      setErrorMessage(ErrorMessage.AddTodo);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingIds(current =>
      current.includes(todoId) ? current : [...current, todoId],
    );

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorMessage.DeleteTodo);
    } finally {
      setDeletingIds(current => current.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (!completedTodos.length) {
      return;
    }

    const completedIds = completedTodos.map(todo => todo.id);

    setDeletingIds(current => [
      ...current,
      ...completedIds.filter(id => !current.includes(id)),
    ]);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successfulIds = completedTodos
      .filter((_, index) => results[index].status === 'fulfilled')
      .map(todo => todo.id);
    const hasError = results.some(result => result.status === 'rejected');

    if (successfulIds.length) {
      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulIds.includes(todo.id)),
      );
    }

    if (hasError) {
      setErrorMessage(ErrorMessage.DeleteTodo);
    }

    setDeletingIds(current => current.filter(id => !completedIds.includes(id)));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filterBy === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filterBy === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          title={title}
          onTitleChange={setTitle}
          onSubmit={handleAddTodo}
          isDisabled={isAdding}
          inputRef={newTodoFieldRef}
        />

        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          deletingIds={deletingIdsSet}
          onDelete={handleDeleteTodo}
        />

        <TodoFooter
          hasTodos={todos.length > 0}
          filterBy={filterBy}
          activeTodosCount={activeTodos.length}
          onFilterChange={setFilterBy}
          onClearCompleted={handleClearCompleted}
          hasCompletedTodos={todos.some(todo => todo.completed)}
        />
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
