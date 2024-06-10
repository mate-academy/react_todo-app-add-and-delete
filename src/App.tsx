/* eslint-disable import/extensions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { Error } from './types/Error';

import { Header } from './components/Header/Header';
// eslint-disable-next-line import/extensions
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Status>(Status.All);
  const [error, setError] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setError(Error.UnableLoad));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timeout = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(timeout);
  }, [error]);

  const titleField = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (titleField.current) {
      titleField.current?.focus();
    }
  }, [todos]);

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(Error.EmptyTitle);

      return;
    }

    if (titleField.current) {
      titleField.current.disabled = true;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      completed: false,
      userId: todoService.USER_ID,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    setLoadingTodos(current => [...current, 0]);

    todoService
      .creatTodo(newTodo)
      .then((newTodoFromServer: Todo) => {
        setTodos(currentTodos => [...currentTodos, newTodoFromServer]);
        setTitle('');
      })
      .catch(() => setError(Error.UnableAdd))
      .finally(() => {
        if (titleField.current) {
          titleField.current.disabled = false;
          titleField.current.focus();
        }

        setTempTodo(null);
        setLoadingTodos(current => current.filter(todoId => todoId !== 0));
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodos(current => [...current, todoId]);
    todoService
      .deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setError(Error.UnableDelete))
      .finally(() => {
        setLoadingTodos(current =>
          current.filter(deletingTodoId => todoId !== deletingTodoId),
        );
      });
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const deleteAllCompleted = () => {
    const completedTodosIds = completedTodos.map(todo => todo.id);

    const requests: Promise<unknown>[] = [];

    completedTodosIds.forEach(todoId =>
      requests.push(todoService.deleteTodo(todoId)),
    );

    setLoadingTodos(current => [...current, ...completedTodosIds]);
    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleAddTodo={handleAddTodo}
          titleField={titleField}
          title={title}
          setTitle={setTitle}
        />

        <TodoList
          todos={todos}
          tempTodo={tempTodo}
          filterBy={filterBy}
          handleDeleteTodo={handleDeleteTodo}
          loadingTodos={loadingTodos}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            deleteAllCompleted={deleteAllCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!error && 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
