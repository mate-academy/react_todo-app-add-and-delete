import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { ErrorNotification } from './Components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const newTodoField = useRef<HTMLInputElement>(null);

  const visibleTodos = todos.filter(todo => {
    if (filterStatus === 'Active') {
      return !todo.completed;
    }

    if (filterStatus === 'Completed') {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const triggerError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setErrorMessage('');
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        triggerError('Unable to load todos');
      });
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      triggerError('Title should not be empty');

      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    });

    addTodo({
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        triggerError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const handleDelete = (todoId: number) => {
    setErrorMessage('');
    setProcessingIds(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        triggerError('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingIds(current => current.filter(id => id !== todoId));
        newTodoField.current?.focus();
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const hasCompletedTodos = todos.some(todo => todo.completed);

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setErrorMessage('');
    setProcessingIds(current => [...current, ...completedTodos.map(t => t.id)]);

    const deletePromises = completedTodos.map(todo => {
      return deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
        })
        .catch(error => {
          throw error;
        })
        .finally(() => {
          setProcessingIds(current => current.filter(id => id !== todo.id));
        });
    });

    Promise.all(deletePromises)
      .catch(() => {
        triggerError('Unable to delete a todo');
      })
      .finally(() => {
        newTodoField.current?.focus();
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          inputRef={newTodoField}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            processingIds={processingIds}
            onDelete={handleDelete}
            tempTodo={tempTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            hasCompleted={hasCompletedTodos}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
