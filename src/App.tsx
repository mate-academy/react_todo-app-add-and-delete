import React, { useEffect, useRef, useState } from 'react';
import * as postServise from './api/todos';
import { Todo } from './types/Todo';
import { Actions } from './types/Actions';
import { ListOfTodos } from './components/ListOfTodos';
import { FooterTodos } from './components/FooterTodos';
import { ErrorNotification } from './components/ErrorNotification';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(true);
  const [filterActions, setFilterActions] = useState<Actions>(Actions.ALL);
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [newInputTitle, setNewInputTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const timeoutId = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    const timeout = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);

    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    focusInput();

    postServise
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setShowNotification(false);
        setError('Unable to load todos');
        timeoutId.current = window.setTimeout(() => {
          setShowNotification(true);
        }, 3000);
      });

    return () => {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  const errorNotification = (message: string) => {
    setShowNotification(false);
    setError(message);
    if (timeoutId.current !== null) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = window.setTimeout(() => {
      setShowNotification(true);
    }, 3000);
  };

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInputTitle(e.currentTarget.value);
  };

  const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const titleTrim = newInputTitle.trim();

    if (titleTrim.length === 0) {
      errorNotification('Title should not be empty');
      focusInput();

      return;
    }

    const newTodo = {
      id: 0,
      userId: postServise.USER_ID,
      title: titleTrim,
      completed: false,
    };

    setTempTodo(newTodo);
    setLoading(prev => ({ ...prev, [newTodo.id]: true }));
    setIsInputDisabled(true);

    const { userId, title, completed } = newTodo;

    postServise
      .postTodos({ userId, title, completed })
      .then(newTodoFromServer => {
        setTodos(currentTodos => [...currentTodos, newTodoFromServer as Todo]);
        setTempTodo(null);
        setNewInputTitle('');
        setLoading(prev => {
          const { [newTodo.id]: ignored, ...rest } = prev;

          return rest;
        });
      })
      .catch(() => {
        setTempTodo(null);
        errorNotification(`Unable to add a todo`);
      })
      .finally(() => {
        setIsInputDisabled(false);
        focusInput();
      });
  };

  const deleteTodo = (todoId: number) => {
    setLoading(prevLoading => ({ ...prevLoading, [todoId]: true }));
    postServise
      .deleteTodos(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(({ id }) => id !== todoId),
        ),
      )
      .catch(() => {
        errorNotification('Unable to delete a todo');
      })
      .finally(() => {
        setLoading(prevLoading => {
          const { [todoId]: ignored, ...rest } = prevLoading;

          return rest;
        });
        focusInput();
      });
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(
      todo =>
        new Promise<void>(resolve => {
          deleteTodo(todo.id);
          resolve();
        }),
    );

    await Promise.allSettled(deletePromises);
  };

  const hasCompletedTodos = todos.some(todo => todo.completed);

  const checkCompleted = todos?.every(todo => todo.completed === true);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: checkCompleted,
            })}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={addTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              value={newInputTitle}
              ref={inputRef}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={handleTitle}
              disabled={isInputDisabled}
            />
          </form>
        </header>

        <ListOfTodos
          todos={todos}
          actions={filterActions}
          onDelete={deleteTodo}
          loading={loading}
          tempTodo={tempTodo}
        />

        <FooterTodos
          todos={todos}
          handleAction={setFilterActions}
          hasComletedTodos={hasCompletedTodos}
          clearCompleted={() => clearCompleted()}
        />
      </div>

      <ErrorNotification
        showNotification={showNotification}
        errorMessage={error}
        deleteNotification={setShowNotification}
      />
    </div>
  );
};
