/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { NewTodo } from './components/NewTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [focusRequest, setFocusRequest] = useState(0);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setErrorMessage(ErrorMessage.None);

    getTodos()
      .then(loadedTodos => {
        setTodos(loadedTodos);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setErrorMessage(ErrorMessage.None);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  const { activeTodos, completedTodos } = useMemo(() => {
    const active: Todo[] = [];
    const completed: Todo[] = [];

    for (const todo of todos) {
      if (todo.completed) {
        completed.push(todo);
      } else {
        active.push(todo);
      }
    }

    return {
      activeTodos: active,
      completedTodos: completed,
    };
  }, [todos]);

  const activeTodosCount = activeTodos.length;

  let visibleTodos: Todo[];

  switch (filter) {
    case FilterStatus.Active:
      visibleTodos = activeTodos;
      break;

    case FilterStatus.Completed:
      visibleTodos = completedTodos;
      break;

    default:
      visibleTodos = todos;
  }

  const allTodosCompleted = todos.length > 0 && activeTodosCount === 0;

  const handleAdd = (title: string): Promise<boolean> => {
    if (tempTodo !== null) {
      return Promise.resolve(false);
    }

    setErrorMessage(ErrorMessage.None);

    setTempTodo({
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    });

    return createTodo(title)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);

        return true;
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);

        return false;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDelete = (todoId: number) => {
    if (deletingIds.includes(todoId)) {
      return;
    }

    setErrorMessage(ErrorMessage.None);

    setDeletingIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setDeletingIds(currentIds => currentIds.filter(id => id !== todoId));

        setFocusRequest(current => current + 1);
      });
  };

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allTodosCompleted,
              })}
              data-cy="ToggleAllButton"
              disabled
            />
          )}

          {/* Add a todo on form submit */}
          <NewTodo
            isAdding={tempTodo !== null}
            focusRequest={focusRequest}
            onAdd={handleAdd}
            onError={setErrorMessage}
          />
        </header>

        {(todos.length > 0 || tempTodo !== null) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            deletingIds={deletingIds}
            onDelete={handleDelete}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            filter={filter}
            onFilterChange={setFilter}
            hasCompletedTodos={completedTodos.length > 0}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage(ErrorMessage.None)}
      />
    </div>
  );
};
