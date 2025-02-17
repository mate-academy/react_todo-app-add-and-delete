/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Status } from './types/Status';
import { TodoList } from './components/Todolist';
import { Error } from './types/Error';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(res => setTodos(res))
      .catch(() => setErrorMessage(Error.UnableLoadTodos));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeout = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timeout);
  }, [errorMessage]);

  const titleField = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (titleField.current) {
      titleField.current?.focus();
    }
  }, [todos]);

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimedTitle = title.trim();

    if (!trimedTitle) {
      setErrorMessage(Error.EmptyTitle);

      return;
    }

    if (titleField.current) {
      titleField.current.disabled = true;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: trimedTitle,
      completed: false,
      userId: todoService.USER_ID,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    setLoadingTodos(current => [...current, 0]);

    todoService
      .createTodo(newTodo)
      .then(newTodoFromServer => {
        setTodos(currentTodos => [...currentTodos, newTodoFromServer]);
        setTitle('');
      })
      .catch(() => setErrorMessage(Error.UnableAdd))
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
      .catch(() => setErrorMessage(Error.UnableDelete))
      .finally(() =>
        setLoadingTodos(current =>
          current.filter(deletingTodoId => todoId !== deletingTodoId),
        ),
      );
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const deleteAllCompleted = () => {
    const completedTodosIds = completedTodos.map(todo => todo.id);

    const request: Promise<unknown>[] = [];

    completedTodosIds.forEach(todoId =>
      request.push(todoService.deleteTodo(todoId)),
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
          selectedFilter={selectedFilter}
          handleDeleteTodo={handleDeleteTodo}
          loadingTodos={loadingTodos}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            deleteAllCompleted={deleteAllCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage && 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
