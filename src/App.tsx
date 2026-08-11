/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { UserWarning } from './components/UserWarning';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { USER_ID, getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );
  const [filter, setFilter] = useState<Status>(Status.All);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  useEffect(() => {
    newTodoFieldRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isAdding) {
      setTimeout(() => {
        newTodoFieldRef.current?.focus();
      }, 0);
    }
  }, [isAdding]);

  useEffect(() => {
    if (errorMessage === ErrorMessage.None) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage(ErrorMessage.None);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage]);

  useEffect(() => {
    setErrorMessage(ErrorMessage.None);

    getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      });
  }, []);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Status.Active:
        return !todo.completed;
      case Status.Completed:
        return todo.completed;
      case Status.All:
      default:
        return true;
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.TitleEmpty);

      return;
    }

    setErrorMessage(ErrorMessage.None);
    setIsAdding(true);
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    createTodo({ title: trimmedTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
      });
  };

  const handleDelete = (todoId: number) => {
    setErrorMessage(ErrorMessage.None);
    setLoadingTodoIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
        setTimeout(() => {
          newTodoFieldRef.current?.focus();
        }, 0);
      });
  };

  const handleToggle = (todoId: number) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleClearCompleted = () => {
    setErrorMessage(ErrorMessage.None);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(prev => [...prev, ...completedIds]);

    const deletePromises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => todo.id)
        .catch(() => {
          setErrorMessage(ErrorMessage.Delete);

          return null;
        }),
    );

    Promise.all(deletePromises).then(results => {
      const deletedIds = results.filter((id): id is number => id !== null);

      setTodos(prev => prev.filter(todo => !deletedIds.includes(todo.id)));
      setLoadingTodoIds(prev => prev.filter(id => !completedIds.includes(id)));
      setTimeout(() => {
        newTodoFieldRef.current?.focus();
      }, 0);
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          newTodoFieldRef={newTodoFieldRef}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          isAdding={isAdding}
          handleSubmit={handleSubmit}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              tempTodo={tempTodo}
              loadingTodoIds={loadingTodoIds}
              handleDelete={handleDelete}
              handleToggle={handleToggle}
            />

            <TodoFooter
              activeTodosCount={activeTodosCount}
              completedTodosCount={completedTodos.length}
              filter={filter}
              setFilter={setFilter}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(ErrorMessage.None)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
