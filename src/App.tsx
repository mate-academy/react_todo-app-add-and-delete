import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, createTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/Filter';
import { ErrorText } from './types/Errors';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorText | ''>('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorText.Load));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorText.EmptyTitle);

      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo({ title: trimmedTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => setErrorMessage(ErrorText.Add))
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
        setTimeout(() => {
          if (newTodoFieldRef.current) {
            newTodoFieldRef.current.focus();
          }
        }, 0);
      });
  };

  const handleDelete = (todoId: number) => {
    setErrorMessage('');
    setLoadingTodoIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== todoId));
      })
      .catch(() => setErrorMessage(ErrorText.Delete))
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
        setTimeout(() => {
          if (newTodoFieldRef.current) {
            newTodoFieldRef.current.focus();
          }
        }, 0);
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(t => t.completed);

    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filter === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(t => !t.completed).length;
  const hasCompletedTodos = todos.some(t => t.completed);
  const isAllCompleted = todos.length > 0 && activeTodosCount === 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={newTodoTitle}
          onChange={setNewTodoTitle}
          onSubmit={handleAddTodo}
          disabled={isSubmitting}
          inputRef={newTodoFieldRef}
          isAllCompleted={isAllCompleted}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              loadingTodoIds={loadingTodoIds}
              onDelete={handleDelete}
            />

            <Footer
              activeCount={activeTodosCount}
              filter={filter}
              setFilter={setFilter}
              hasCompleted={hasCompletedTodos}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
