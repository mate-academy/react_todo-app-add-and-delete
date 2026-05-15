/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, patchTodo, USER_ID } from './api/todos';
import { NewTodoList } from './components/NewTodoList';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { FILTER } from './api/filter';
import { Filter } from './types/Filter';
import classNames from 'classnames';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filter, setFilter] = useState<Filter>(FILTER.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const isTodosNotEmpty = todos.length > 0;

  const loadingPosts = () => {
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadingPosts();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => window.clearTimeout(timerId);
  }, [errorMessage]);

  const getVisibleTodos = () => {
    switch (filter) {
      case FILTER.active:
        return todos.filter(todo => !todo.completed);

      case FILTER.completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const visibleTodos = getVisibleTodos();

  const handleDelete = (todoId: number) => {
    setIsLoading(true);
    setIsDeleting(true);
    setDeletingTodoId(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setIsLoading(false);
        setIsDeleting(false);
        setDeletingTodoId(null);
      });
  };

  const handleChecked = (todo: Todo) => {
    setIsLoading(true);

    const updatedTodo: Todo = {
      ...todo,
      completed: !todo.completed,
    };

    patchTodo(updatedTodo)
      .then(() => {
        setTodos(current =>
          current.map(item => (item.id === todo.id ? updatedTodo : item)),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleToggleAll = (posts: Todo[]) => {
    const areAllTodosCompleted = posts.every(t => t.completed);

    if (!areAllTodosCompleted) {
      posts.map(t => {
        if (!t.completed) {
          handleChecked(t);
        }
      });
    } else {
      posts.map(t => {
        if (t.completed) {
          handleChecked(t);
        }
      });
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodoList
          todos={todos}
          title={title}
          isLoading={isLoading}
          isDeleting={isDeleting}
          setTitle={setTitle}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setIsLoading={setIsLoading}
          setTempTodo={setTempTodo}
          onToggleAll={handleToggleAll}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={visibleTodos}
            deletingTodoId={deletingTodoId}
            onDelete={handleDelete}
            onChecked={handleChecked}
          />
          {tempTodo && <TodoItem todo={tempTodo} isLoading />}
        </section>

        {/* Hide the footer if there are no todos */}
        {isTodosNotEmpty && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errorMessage === '',
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
