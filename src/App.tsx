import React, { useEffect, useRef, useState } from 'react';
import { createTodo, getTodos, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/todoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';

function getFilteredTodos(todos: Todo[], filterBy: Filter) {
  return todos.filter(todo => {
    switch (filterBy) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      case Filter.All:
      default:
        return true;
    }
  });
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Filter>(Filter.All);
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.None);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => inputRef.current?.focus();
  const filteredTodos = getFilteredTodos(todos, status);
  const hasCompletedTodos = todos.some(todo => todo.completed);

  useEffect(() => {
    getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
      })
      .catch(() => setError(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(ErrorMessage.None), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    focusInput();
  }, [tempTodo]);

  const countActiveTodo = todos.filter(element => !element.completed).length;

  const handleStatusChange = (newStatus: Filter) => {
    setStatus(newStatus);
  };

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (tempTodo) {
      return;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo({ title: trimmedTitle, completed: false, userId: USER_ID })
      .then(todoFromServer => {
        setTodos(currentTodos => [...currentTodos, todoFromServer]);
        setTitle('');
      })
      .catch(() => {
        setError(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
        focusInput();
      });
  };

  const handleDelete = (id: number) => {
    setLoadingIds(current => [...current, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError(ErrorMessage.Delete);
      })
      .finally(() => {
        setLoadingIds(current => current.filter(currentId => currentId !== id));
        focusInput();
      });
  };

  const clearCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => handleDelete(todo.id));
  };

  const clearError = () => {
    setError(ErrorMessage.None);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          disabled={Boolean(tempTodo)}
          handleTitleChange={handleTitleChange}
          handleSubmitForm={handleSubmitForm}
          inputRef={inputRef}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            loadingIds={loadingIds}
            handleDelete={handleDelete}
          />
        )}

        {todos.length > 0 && (
          <Footer
            status={status}
            count={countActiveTodo}
            handleStatusChange={handleStatusChange}
            clearCompleted={clearCompleted}
            hasCompletedTodos={hasCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification error={error} clearError={clearError} />
    </div>
  );
};
