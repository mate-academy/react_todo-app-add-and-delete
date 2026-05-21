/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';

type Filter = 'all' | 'active' | 'completed';

enum ErrorMessage {
  Load = 'Unable to load todos',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  EmptyTitle = 'Title should not be empty',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const focusInput = () => {
    setTimeout(() => {
      const input = document.querySelector(
        '[data-cy="NewTodoField"]',
      ) as HTMLInputElement | null;

      input?.focus();
    });
  };

  const loadTodos = () => {
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  async function addTodo(todoTitle: string) {
    try {
      const newTodo = await client.post<Todo>('/todos', {
        title: todoTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos(current => {
        const withoutTemp = current.filter(todo => todo.id !== 0);

        return [...withoutTemp, newTodo];
      });

      setTempTodo(null);
      setTitle('');
      setIsAdding(false);
    } catch (error) {
      setErrorMessage(ErrorMessage.Add);
      setTempTodo(null);
      setIsAdding(false);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setTimeout(() => {
        focusInput();
      }, 0);
    }
  }

  async function deleteTodo(todoId: number) {
    try {
      setLoadingTodoIds(current => [...current, todoId]);

      await client.delete(`/todos/${todoId}`);

      setTodos(current => current.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorMessage.Delete);
    } finally {
      setLoadingTodoIds(current => current.filter(id => id !== todoId));
      focusInput();
    }
  }

  const clearCompleted = async () => {
    const comletedTodos = todos.filter(todo => todo.completed);

    await Promise.all(comletedTodos.map(todo => deleteTodo(todo.id)));
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();

    if (isAdding) {
      return;
    }

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    setIsAdding(true);

    addTodo(trimmedTitle);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          title={title}
          setTitle={setTitle}
          onSubmit={handleSubmit}
          isAdding={isAdding}
        />

        <section>
          <TodoList
            loading={loading}
            todos={visibleTodos}
            onDelete={deleteTodo}
            loadingTodoIds={loadingTodoIds}
          />

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              loading={true}
              onDelete={() => {}}
              isTemp
            />
          )}
        </section>
        {todos.length > 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={todos.some(todo => todo.completed)}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        clearError={() => setErrorMessage('')}
      />
    </div>
  );
};
