/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Error } from './types/Error';
import { TodoStatus } from './utils/getFilteredTodos';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<TodoStatus>('All');
  const [error, setError] = useState<string>('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [managingTodos, setManagingTodos] = useState<number[]>([]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setError(Error.UnableLoad);
        setTimeout(() => setError(''), 3000);
      });
  }, []);

  /* eslint-disable */
  if (!todoService.USER_ID) {
    return <UserWarning />;
  }
  /* eslint-disable */

  const handleTypingTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  const handleAddingTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Error.EmptyTitle);

      return;
    }

    setError('');

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      completed: false,
      userId: todoService.USER_ID,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    setManagingTodos(current => [...current, 0]);

    todoService
      .createTodo(newTodo)
      .then(newAddedTodo => {
        setTodos(currentTodos => [...currentTodos, newAddedTodo]);
        setTitle('');
      })
      .catch(() => setError(Error.UnableAdd))
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
        setManagingTodos(current => current.filter(todoId => todoId !== 0));
      });
  };

  const handleDeletingTodo = (todoId: number) => {
    setManagingTodos(current => [...current, todoId]);
    todoService
      .deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setError(Error.UnableDelete))
      .finally(() => {
        setManagingTodos(currentTodos =>
          currentTodos.filter(deletedTodoId => deletedTodoId !== todoId),
        );
      });
  };

  const handleDeletingAllCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeletingTodo(todo.id);
      }
    });
  };

  const handleErrorNotifications = () => setError('');

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          inputRef={inputRef}
          handleAddingTodo={handleAddingTodo}
          title={title}
          handleTypingTodo={handleTypingTodo}
        />

        <TodoList
          todos={todos}
          tempTodo={tempTodo}
          status={status}
          handleDeletingTodo={handleDeletingTodo}
          managingTodos={managingTodos}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            status={status}
            setStatus={setStatus}
            handleDeletingAllCompleted={handleDeletingAllCompleted}
          />
        )}
      </div>

      <ErrorNotification
        error={error}
        handleErrorNotifications={handleErrorNotifications}
      />
    </div>
  );
};
