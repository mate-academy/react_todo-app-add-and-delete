/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import cn from 'classnames';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { useState } from 'react';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Filter } from './types/Filters';
import { ErrorTypes } from './types/ErrorTypes';
import { addTodo } from './api/todos';
import { deleteTodo } from './api/todos';
import { useRef } from 'react';
import { useLayoutEffect } from 'react';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.All);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [deleteId, setDeleteId] = useState<number[]>([]);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    newTodoFieldRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrorMessage('');
    setIsLoading(true);

    getTodos()
      .then(data => setTodos(data))
      .catch(() => {
        setErrorMessage(ErrorTypes.LoadTodos);
        window.setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
        newTodoFieldRef.current?.focus();
      });
  }, []);

  const itemsLeft = todos.filter(todo => !todo.completed).length;

  const visibleTodos = todos.filter((todo: Todo) => {
    switch (filterStatus) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage(ErrorTypes.EmptyTitle);
      setNewTodoTitle('');
      newTodoFieldRef.current?.focus();

      return;
    }

    const newTodoItem = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setIsAdded(true);
    setTemporaryTodo(newTodoItem);

    addTodo(newTodoItem)
      .then(({ id, userId, title: todoTitle, completed }) => {
        const newTodo = {
          id,
          userId,
          title: todoTitle,
          completed,
        };

        setTodos(prevTodos => [...prevTodos, newTodo]);
        setNewTodoTitle('');

        newTodoFieldRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.AddTodo);
        newTodoFieldRef.current?.focus();
      })
      .finally(() => {
        setIsAdded(false);
        setTemporaryTodo(null);
        newTodoFieldRef.current?.focus();
      });
  };

  const handleDeleteTodo = (id: number) => {
    setDeleteId(prevId => [...prevId, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(prev => {
          const idIndex = prev.findIndex(elem => elem.id === id);

          return [...prev.slice(0, idIndex), ...prev.slice(idIndex + 1)];
        });
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.DeleteTodo);
      })
      .finally(() => {
        setDeleteId(prev => {
          const idIndex = prev.findIndex(elem => elem === id);

          return [...prev.slice(0, idIndex), ...prev.slice(idIndex + 1)];
        });

        newTodoFieldRef.current?.focus();
      });
  };

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  useEffect(() => {
    if (!isAdded) {
      newTodoFieldRef.current?.focus();
    }
  }, [isAdded]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: todos.length > 0 && todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={isAdded}
              ref={newTodoFieldRef}
            />
          </form>
        </header>

        {isLoading && <div className="loader"></div>}

        <TodoList
          visibleTodos={visibleTodos}
          handleDeleteTodo={handleDeleteTodo}
          deleteId={deleteId}
          temporaryTodo={temporaryTodo}
        />

        {todos.length > 0 && (
          <Footer
            itemsLeft={itemsLeft}
            todos={todos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            handleDeleteTodo={handleDeleteTodo}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
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
