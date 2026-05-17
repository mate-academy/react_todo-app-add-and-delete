/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState('');

  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const titleField = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos.length]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      showError(ErrorMessage.EmptyTitle);

      return;
    }

    setTempTodo({
      id: 0,
      title: normalizedTitle,
      completed: false,
      userId: USER_ID,
    });

    addTodo(normalizedTitle)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        showError(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setTimeout(() => {
          titleField.current?.focus();
        }, 0);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setProcessingIds(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        showError(ErrorMessage.Delete);
      })
      .finally(() => {
        setProcessingIds(current => current.filter(id => id !== todoId));
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const idsToDelete = completedTodos.map(todo => todo.id);

    setProcessingIds(current => [...current, ...idsToDelete]);

    Promise.all(
      completedTodos.map(todo =>
        deleteTodo(todo.id)
          .then(() => todo.id)
          .catch(() => {
            showError(ErrorMessage.Delete);

            return null;
          }),
      ),
    )
      .then(results => {
        const successfulIds = results.filter(id => id !== null);

        setTodos(current =>
          current.filter(todo => !successfulIds.includes(todo.id)),
        );
      })
      .finally(() => {
        setProcessingIds(current =>
          current.filter(id => !idsToDelete.includes(id)),
        );
      });
  };

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Status.Active:
        return !todo.completed;
      case Status.Completed:
        return todo.completed;
      case Status.All:
      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          onAddTodo={handleAddTodo}
          activeTodosCount={activeTodosCount}
          todosLength={todos.length}
          tempTodo={tempTodo}
          titleField={titleField}
        />

        {(todos.length > 0 || tempTodo !== null) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            processingIds={processingIds}
            onDelete={handleDeleteTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            filter={filter}
            onFilterChange={setFilter}
            hasCompletedTodos={hasCompletedTodos}
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
