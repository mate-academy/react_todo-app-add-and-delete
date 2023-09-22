/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';
import { TodoFooter } from './components/TodoFooter';
import { deleteTodos, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Error } from './types/Error';
import { Errors } from './components/Errors';

const USER_ID = 11142;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.all);
  const [error, setError] = useState(Error.without);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);
  const numberOfAllTodos = todos.length;
  const numberOfCompletedTodos = todos.filter(todo => todo.completed).length;
  const numberOfActiveTodos = todos.filter(todo => !todo.completed).length;

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos);
  }, []);

  const onDeleteTodo = (todoId: number) => {
    setDeletingIds((ids) => [...ids, todoId]);
    deleteTodos(todoId)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(todo => todo.id !== todoId),
      ))
      .catch(() => setError(Error.delete))
      .finally(() => {
        setDeletingIds((ids) => ids.filter(id => id !== todoId));
      });
  };

  const visibleTodos = useMemo(() => {
    if (todos) {
      return todos
        .filter(todo => {
          switch (status) {
            case Status.completed:
              return todo.completed;

            case Status.active:
              return !todo.completed;

            default:
              return true;
          }
        });
    }

    return [];
  }, [todos, status]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          numberOfActiveTodos={numberOfActiveTodos}
          setTempTodo={setTempTodo}
          setError={setError}
          userId={USER_ID}
          setTodos={setTodos}
          processing={processing}
          setProcessing={setProcessing}
        />

        {numberOfAllTodos !== 0 && (
          <TodoList
            todos={visibleTodos}
            onDeleteTodo={onDeleteTodo}
            deletingIds={deletingIds}
          />
        )}

        {tempTodo && (
          <TodoItem
            tempTodo={tempTodo}
            processing={processing}
          />
        )}

        {numberOfAllTodos !== 0 && (
          <TodoFooter
            numberOfActiveTodos={numberOfActiveTodos}
            numberOfCompletedTodos={numberOfCompletedTodos}
            onStatusChange={setStatus}
            status={status}
            onDeleteTodo={onDeleteTodo}
            todos={todos}
          />
        )}
      </div>

      {error !== Error.without && (
        <Errors error={error} onClearErrors={setError} />
      )}
    </div>
  );
};
