/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { createTodo } from './api/todos';
import { delTodos } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
export const App: React.FC = () => {
  const [isInput, setIsInput] = useState('');
  const [isTodo, setTodo] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [errorType, setErrorType] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  const handleError = (type: string) => {
    setErrorType(type);
    setTimeout(() => setErrorType(null), 3000);
  };

  useEffect(() => {
    if (!USER_ID) {
      return <UserWarning />;
    }

    getTodos()
      .then(data => setTodo(Array.isArray(data) ? data : []))
      .catch(() => {
        handleError('Unable to load todos');
      })
      .finally(() => {});
  }, []);

  function addTodo(userId, title, completed) {
    const newTempTodo: Todo = {
      id: 0,
      userId,
      title,
      completed,
    };

    setTempTodo(newTempTodo);

    return createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodo(currentTodo => [...currentTodo, newTodo]);
      })
      .finally(() => {
        setTempTodo(null);
      });
  }

  const getFilter = () => {
    switch (filter) {
      case 'active':
        return isTodo.filter(todo => !todo.completed);
      case 'completed':
        return isTodo.filter(todo => todo.completed);
      default:
        return isTodo;
    }
  };

  const handleRemoveTodo = (todoId: number) => {
    setLoadingTodoId(current => [...current, todoId]);

    delTodos(todoId)
      .then(() => {
        setTodo(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => handleError('Unable to delete a todo'))
      .finally(() => {
        setLoadingTodoId(current => current.filter(id => id !== todoId));
      });
  };

  const handleRemoveCompleted = () => {
    const completedTodos = isTodo.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingTodoId(prev => [...prev, ...completedIds]);

    Promise.allSettled(completedTodos.map(todo => delTodos(todo.id)))
      .then(results => {
        const successfullyDeletedIds = results
          .map((result, index) =>
            result.status === 'fulfilled' ? completedIds[index] : null,
          )
          .filter(id => id !== null);

        setTodo(prev =>
          prev.filter(todo => !successfullyDeletedIds.includes(todo.id)),
        );

        setLoadingTodoId(prev =>
          prev.filter(id => !successfullyDeletedIds.includes(id)),
        );

        if (results.some(result => result.status === 'rejected')) {
          handleError('Unable to delete a todo');
        }
      })
      .catch(() => {
        handleError('Unable to delete todo');
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {
          <TodoHeader
            isInput={isInput}
            setIsInput={setIsInput}
            createTodo={addTodo}
            setErrorType={setErrorType}
            handleError={handleError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        }
        {
          <TodoList
            getFilter={getFilter}
            handleRemoveTodo={handleRemoveTodo}
            tempTodo={tempTodo}
            isLoading={isLoading}
            loadingTodoId={loadingTodoId}
          />
        }

        {/* Hide the footer if there are no todos */}
        {isTodo.length > 0 && (
          <TodoFooter
            setFilter={setFilter}
            isTodo={isTodo}
            filter={filter}
            handleRemoveCompleted={handleRemoveCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification setErrorType={setErrorType} errorType={errorType} />
    </div>
  );
};
