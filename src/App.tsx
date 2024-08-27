/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo, TodoStatusFilter } from './types/Todo';
import { TodoError } from './components/TodoError';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessages } from './constans/ErrorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMessages | null>(null);
  const [selectedStatus, setSelectedStatus] = useState(TodoStatusFilter.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessages.LoadTodos);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (selectedStatus) {
      case TodoStatusFilter.Active:
        return todos.filter(todo => !todo.completed);
      case TodoStatusFilter.Completed:
        return todos.filter(todo => todo.completed);
      case TodoStatusFilter.All:
      default:
        return todos;
    }
  }, [todos, selectedStatus]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleNewTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodoTitle.trim()) {
      setError(ErrorMessages.EmptyTitle);

      return;
    }

    const trimmedTitle = newTodoTitle.trim();
    const currentTodo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setIsSubmitting(true);

    setTempTodo(currentTodo);

    createTodo(currentTodo)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => setError(ErrorMessages.AddTodo))
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodo => prevTodo.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(ErrorMessages.DeleteTodo);
      })
      .finally(() => {
        setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
      });
  };

  const handleDeleteCompletedTodos = (completeTodos: Todo[]) => {
    completeTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const handleSelectStatus = (status: TodoStatusFilter) => {
    setSelectedStatus(status);
  };

  const handleErrorClose = () => {
    setError(null);
  };

  const hasCompletedTodos = todos.some(todo => todo.completed);
  const hasTodos = todos.length > 0;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          isSubmitting={isSubmitting}
          handleTitleChange={handleTitleChange}
          handleNewTodoSubmit={handleNewTodoSubmit}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          isSubmitting={isSubmitting}
          submittingTodoIds={loadingTodoIds}
          handleDeleteTodo={handleDeleteTodo}
        />

        {hasTodos && (
          <Footer
            todos={todos}
            hasCompletedTodos={hasCompletedTodos}
            selectedStatus={selectedStatus}
            handleSelectStatus={handleSelectStatus}
            onDeleteCompletedTodos={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <TodoError message={error} onClose={handleErrorClose} />
    </div>
  );
};
