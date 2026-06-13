/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';

import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
  USER_ID,
} from './api/todos';

import { Todo } from './types/Todo';
import { Query } from './types/Query';

import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { filterTodo } from './api/utils/filterTodos';
import { ErrorNotification } from './components/ErrorNotification';

const ERROR_DELAY = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [query, setQuery] = useState<Query>('All');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const setError = useCallback((msg: string) => {
    setErrorMessage(msg);

    setTimeout(() => {
      setErrorMessage('');
    }, ERROR_DELAY);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (error) {
        setError('Unable to load todos');
      }
    })();
  }, [setError]);

  const onAdd = useCallback(
    async (title: string) => {
      if (title === '') {
        setError('Title should not be empty');

        return;
      }

      const preparedData = {
        userId: USER_ID,
        title,
        completed: false,
      };

      setTempTodo({ id: 0, ...preparedData });

      try {
        const addedTodo = await postTodo(preparedData);

        setTodos(currentTodos => {
          return [...currentTodos, addedTodo];
        });
      } catch (error) {
        setError('Unable to add a todo');
        throw error;
      } finally {
        setTempTodo(null);
      }
    },
    [setError],
  );

  const onUpdate = useCallback(
    async (todoToUpdate: Partial<Todo> & Pick<Todo, 'id'>) => {
      try {
        await patchTodo(todoToUpdate.id, todoToUpdate);

        setTodos(currentTodos => {
          return currentTodos.map(todo => {
            if (todo.id === todoToUpdate.id) {
              return { ...todo, ...todoToUpdate };
            }

            return todo;
          });
        });
      } catch (error) {
        setError('Unable to update a todo');
        throw error;
      }
    },
    [setError],
  );

  const onDelete = useCallback(
    async (todoId: number) => {
      try {
        await deleteTodo(todoId);

        setTodos(currentTodos => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      } catch (error) {
        setError('Unable to delete a todo');
        throw error;
      }
    },
    [setError],
  );

  const handleClearCompleted = useCallback(async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    completedTodos.forEach(todo => {
      onDelete(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
          );
        })
        .catch(() => {
          setError('Unable to delete a todo');
        });
    });
  }, [todos, setError, onDelete]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const preparedTodos = filterTodo(todos, query);
  const completedCount = filterTodo(todos, 'Completed')?.length || 0;
  const activeCount = todos.length - completedCount;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAdd={onAdd} />

        {(preparedTodos.length > 0 || tempTodo) && (
          <TodoList
            todos={preparedTodos}
            tempTodo={tempTodo}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            completedCount={completedCount}
            handleClearCompleted={handleClearCompleted}
            query={query}
            setQuery={setQuery}
          />
        )}
      </div>

      <ErrorNotification
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
};
