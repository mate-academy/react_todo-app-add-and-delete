/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { creatTodo, deleteTodo, getTodos, USER_ID } from './api/toods';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { Header } from './components/Header';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const showError = (message: ErrorMessage) => {
    setErrorMessage(message);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        showError(ErrorMessage.Load);
      });
  }, []);

  const handleAddTodo = async (title: string): Promise<void> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessage.TitleEmpty);

      return Promise.reject();
    }

    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    try {
      const newTodo = await creatTodo({
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (error) {
      showError(ErrorMessage.Add);
      throw error;
    } finally {
      setTempTodo(null);
      setIsSubmitting(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      showError(ErrorMessage.Delete);
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(prev => [...prev, ...completedIds]);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successfullyDeletedIds: number[] = [];
    let hasError = false;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfullyDeletedIds.push(completedTodos[index].id);
      } else {
        hasError = true;
      }
    });

    if (hasError) {
      showError(ErrorMessage.Delete);
    }

    setTodos(prevTodos =>
      prevTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
    );

    setLoadingTodoIds(prev => prev.filter(id => !completedIds.includes(id)));
  };

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterStatus.Active:
          return !todo.completed;
        case FilterStatus.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={handleAddTodo}
          isSubmitting={isSubmitting}
          todosCount={todos.length}
          activeTodosCount={todos.filter(todo => !todo.completed).length}
          loadingTodosCount={loadingTodoIds.length}
        />
        {todos.length > 0 || tempTodo ? (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            onDeleteTodo={handleDeleteTodo}
          />
        ) : null}
        {/* Hide the footer if there are no todos */}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
