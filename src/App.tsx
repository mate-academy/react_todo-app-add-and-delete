/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ErrorNotif } from './components/ErrorNotif/ErrorNotif';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodosError } from './types/TodoError';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  // #region States
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isEdited, setIsEdited] = useState(0);
  const [error, setErrorMessage] = useState<TodosError>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // #endregion

  // #region useEffect

  // getting todo
  useEffect(() => {
    todoService
      .getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  // setting an error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [error]);

  // setting focus
  useEffect(() => {
    if (!isCreating) {
      inputRef.current?.focus();
    }
  }, [isCreating]);
  // #endregion

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  // #region handler and functions

  // filter Todo
  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  // create a Todo
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsCreating(true);

    const newTodo: Todo = {
      id: 0,
      userId: todoService.USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    todoService
      .createTodo(newTodo)
      .then(data => {
        setTodos(prev => [...prev, data]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsCreating(false);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  // delete Todo
  const handleDelete = (todo: Todo) => {
    setLoadingIds(prev => [...prev, todo.id]);

    todoService
      .deleteTodo(todo.id)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== todo.id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todo.id));
        inputRef.current?.focus();
      });
  };

  // clear All completed Todo
  const handleClearCompleted = async () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...completedIds]);

    try {
      const results = await Promise.allSettled(
        completedIds.map(id => todoService.deleteTodo(id)),
      );

      const successfulIds = results
        .map((res, index) =>
          res.status === 'fulfilled' ? completedIds[index] : null,
        )
        .filter((id): id is number => id !== null);

      if (successfulIds.length > 0) {
        setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));
      }

      if (results.some(res => res.status === 'rejected')) {
        setErrorMessage('Unable to delete a todo');
      }
    } catch {
      setErrorMessage('Unable to load todos');
    } finally {
      setLoadingIds(prev => prev.filter(id => !completedIds.includes(id)));
      inputRef.current?.focus();
    }
  };
  // #endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onCreate={handleCreate}
          title={title}
          onTitle={setTitle}
          isCreating={isCreating}
          inputRef={inputRef}
        />

        <TodoList
          todos={visibleTodos}
          isEdited={isEdited}
          onEdited={setIsEdited}
          loadingIds={loadingIds}
          isCreating={isCreating}
          onDelete={handleDelete}
          tempTitle={title}
        />

        {/* Hide the footer if there are no todos */}
        <Footer
          todos={todos}
          filter={filter}
          onFilter={setFilter}
          onClearCompleted={handleClearCompleted}
        />
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotif onErrorMessage={setErrorMessage} error={error} />
    </div>
  );
};
