/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleError = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(loadedTodos => {
        setTodos(loadedTodos);
      })
      .catch(() => {
        handleError('Unable to load todos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      handleError('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    const nextTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setIsAdding(true);
    setTempTodo(nextTempTodo);

    addTodo(trimmedTitle)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setNewTitle('');
      })
      .catch(() => {
        handleError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setErrorMessage('');
    setProcessingIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingIds(currentIds => currentIds.filter(id => id !== todoId));

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          isAdding={isAdding}
          newTitle={newTitle}
          onSubmit={handleSubmit}
          onTitleChange={setNewTitle}
        />

        <TodoList
          loading={loading}
          onDelete={handleDeleteTodo}
          processingIds={processingIds}
          tempTodo={tempTodo}
          todos={filteredTodos}
        />

        <Footer
          filter={filter}
          hasCompleted={todos.some(todo => todo.completed)}
          loading={loading}
          onClearCompleted={handleClearCompleted}
          setFilter={setFilter}
          todos={todos}
        />
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
