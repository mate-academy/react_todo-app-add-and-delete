/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { getTodos } from './api/todos';
import { client } from './utils/fetchClient';
import { Errors } from './types/Errors';
import { Filter } from './types/Filter';

const USER_ID = 4088;

export const filterOptions = [
  { id: 'all', title: Filter.All, href: '#/' },
  { id: 'active', title: Filter.Active, href: '#/active' },
  { id: 'completed', title: Filter.Completed, href: '#/completed' },
];

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | string>('');
  const [filterStatus, setFilterStatus] = useState(Filter.All);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (error) {
        setErrorMessage(Errors.Load);

        setTimeout(() => setErrorMessage(''), 3000);
      }
    };

    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    switch (filterStatus) {
      case Filter.Active:
        return todos.filter(todo => {
          return todo.completed === false;
        });
      case Filter.Completed:
        return todos.filter(todo => {
          return todo.completed === true;
        });
      default:
        return todos;
    }
  }, [todos, filterStatus]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleDelete = async (todoId: number) => {
    setProcessingIds(prevIds => [...prevIds, todoId]);
    try {
      await client.delete(`/todos/${todoId}`);

      setTodos(prevTodos =>
        prevTodos.filter(todo => {
          return todo.id !== todoId;
        }),
      );

      const input = document.querySelector<HTMLInputElement>(
        '[data-cy="NewTodoField"]',
      );

      input?.focus();
    } catch {
      setErrorMessage(Errors.UnableDelete);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const deleteCompleted = async () => {
    const completedTodos = todos.filter(todo => {
      return todo.completed;
    });

    const deletePromises = completedTodos.map(async todo => {
      try {
        setProcessingIds(prev => [...prev, todo.id]);

        await client.delete(`/todos/${todo.id}`);

        setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
      } catch {
        setErrorMessage(Errors.UnableDelete);
        setTimeout(() => setErrorMessage(''), 3000);
      } finally {
        setProcessingIds(prev => prev.filter(id => id !== todo.id));
      }
    });

    await Promise.all(deletePromises);

    const input = document.querySelector<HTMLInputElement>(
      '[data-cy="NewTodoField"]',
    );

    input?.focus();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTempTodo={setTempTodo}
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
        />

        <TodoList
          visibleTodos={visibleTodos}
          deleteTodo={handleDelete}
          processingIds={processingIds}
          tempTodo={tempTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            clearCompleted={deleteCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
