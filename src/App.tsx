/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Notification } from './components/Notification/Notification';

import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { TodoErrors } from './types/TodoErrors';
import {
  getTodos, USER_ID, createTodo, deleteTodo,
} from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<TodoErrors | null>(null);
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.All);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isProcessed, setIsProcessed] = useState<boolean>(false);
  const [deletedId, setDeletedId] = useState<number | null>(null);

  const deleteTodoHandler = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => setDeletedId(todoId))
      .catch(() => setError(TodoErrors.Delete));
  };

  const createTodoHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(TodoErrors.Empty);
    } else {
      setTempTodo({
        id: 0,
        title,
        completed: false,
        userId: USER_ID,
      });

      setIsProcessed(true);
      createTodo(USER_ID, title)
        .then((todo) => {
          if (todo) {
            setTempTodo(null);
            setTodos([...todos, todo]);
          }
        })
        .catch(() => {
          setError(TodoErrors.Add);
        })
        .finally(() => {
          setIsProcessed(false);
          setTitle('');
        });
    }
  };

  const clearCompletedTodos = () => {
    const completeTodos = todos.filter(todo => todo.completed);

    return completeTodos
      .map(todo => deleteTodo(todo.id)
        .catch(() => setError(TodoErrors.Delete)));
  };

  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const itemsCompleted = todos.filter(todo => todo.completed).length;

  useEffect(() => {
    getTodos(USER_ID)
      .then((fetchedTodos: Todo[]) => {
        setTodos(fetchedTodos);
      })
      .catch(() => {
        setError(TodoErrors.Get);
      });
  }, [deletedId]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const filtredTodos = useMemo(() => {
    switch (status) {
      case TodoStatus.All:
        return todos;
      case TodoStatus.Active:
        return todos.filter((todo) => !todo.completed);
      case TodoStatus.Completed:
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, status]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          activeTodos={itemsLeft}
          title={title}
          onAddTitle={setTitle}
          isProcessed={isProcessed}
          onAddTodo={createTodoHandler}

        />

        <TodoList
          todos={filtredTodos}
          creating={tempTodo}
          onDelete={deleteTodoHandler}
          deletedId={deletedId}
        />

        {todos.length !== 0
          && (
            <TodoFilter
              onStatusChanged={setStatus}
              status={status}
              itemsLeft={itemsLeft}
              itemsCompleted={itemsCompleted}
              clearCompletedTodos={clearCompletedTodos}
            />
          )}
      </div>

      <Notification
        onClose={setError}
        error={error}
      />

    </div>
  );
};
