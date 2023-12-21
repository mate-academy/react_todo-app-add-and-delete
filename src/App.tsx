/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';

import { UserWarning } from './UserWarning';
import { Status, Todo } from './types/Todo';
import * as todosServise from './api/todos';
import { TodoFilter } from './components/TodosFilter';
import { ToogleButton } from './components/ToogleButton';
import { TodoForm } from './components/TodoForm';
import { TodosList } from './components/TodosList';
import { Error } from './types/Error';
import { ErrorNotifications } from './components/ErrorNotifications';
import { USER_ID } from './utils/variables';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [errorType, setErrorType] = useState<Error | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [pending, setPending] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [todoIds, setTodoIds] = useState<number[]>([]);

  useEffect(() => {
    todosServise.getTodos(USER_ID)
      .then(response => {
        setTodos(response);
      })
      .catch((error) => {
        setErrorType(Error.Load);
        throw error;
      });
  }, []);

  function addTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
    setErrorType(null);
    setPending(true);
    setTodoIds([0]);

    setTempTodo({
      title,
      completed,
      userId,
      id: 0,
    });

    todosServise.createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTitle('');
      })
      .catch((error) => {
        setErrorType(Error.Add);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setPending(false);
      });
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setErrorType(Error.EmptyTitle);

      return;
    }

    addTodo({
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });
  };

  const shownTodos = useMemo(() => {
    return todosServise.getVisibleTodos(todos, status);
  }, [todos, status]);

  const onDelete = (todoId: number) => {
    setErrorType(null);
    setTodoIds(currentTodosIds => [...currentTodosIds, todoId]);

    todosServise.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      })
      .catch((error) => {
        setTodos(shownTodos);
        setErrorType(Error.Delete);
        throw error;
      });
  };

  const areAllActiveTodos = todos.some(todo => !todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <ToogleButton areAllActiveTodos={areAllActiveTodos} />

          <TodoForm
            todos={todos}
            handleSubmit={handleSubmit}
            newTitle={newTitle}
            pending={pending}
            setNewTitle={setNewTitle}
          />
        </header>

        <TodosList
          visibleTodos={shownTodos}
          onDelete={onDelete}
          tempTodo={tempTodo}
          todoIds={todoIds}
        />

        {!!todos.length && (
          <TodoFilter
            todos={todos}
            status={status}
            setStatus={setStatus}
            setErrorType={setErrorType}
            onDelete={onDelete}
          />
        )}
      </div>

      {errorType && (
        <ErrorNotifications errorType={errorType} setErrorType={setErrorType} />
      )}
    </div>
  );
};
