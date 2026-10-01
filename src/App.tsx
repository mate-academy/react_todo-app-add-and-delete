/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodos,
  deleteTodos,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter } from './types/Filter';

const ERROR_MESSAGES = {
  LOAD: 'Unable to load todos',
  ADD: 'Unable to add a todo',
  DELETE: 'Unable to delete a todo',
  UPDATE: 'Unable to update a todo',
  EMPTY_TITLE: 'Title should not be empty',
};

export const App: React.FC = () => {
  const [todosTest, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.AllTest);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showError = (message: string) => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    setErrorMessage(message);

    errorTimeoutRef.current = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        showError(ERROR_MESSAGES.LOAD);
      });
  }, []);

  useEffect(() => {
    if (tempTodo === null) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ERROR_MESSAGES.EMPTY_TITLE);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    addTodos({
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        showError(ERROR_MESSAGES.ADD);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDelete = (todoId: number) => {
    setDeletingTodoId(todoId);
    setErrorMessage('');

    deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        showError(ERROR_MESSAGES.DELETE);
      })
      .finally(() => {
        setDeletingTodoId(null);
        inputRef.current?.focus();
      });
  };

  const handleToggle = (todo: Todo) => {
    setUpdatingTodoId(todo.id);

    updateTodo(todo.id, {
      completed: !todo.completed,
    })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => {
        showError(ERROR_MESSAGES.UPDATE);
      })
      .finally(() => {
        setUpdatingTodoId(null);
      });
  };

  const handleRename = (todoId: number, titl: string): Promise<boolean> => {
    setUpdatingTodoId(todoId);

    return updateTodo(todoId, {
      title: titl,
    })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );

        return true;
      })
      .catch(() => {
        showError(ERROR_MESSAGES.UPDATE);

        return false;
      })
      .finally(() => {
        setUpdatingTodoId(null);
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todosTest.filter(todo => todo.completed);

    setErrorMessage('');

    Promise.allSettled(completedTodos.map(todo => deleteTodos(todo.id))).then(
      results => {
        const deletedIds = completedTodos
          .filter((_, index) => results[index].status === 'fulfilled')
          .map(todo => todo.id);

        setTodos(currentTodos =>
          currentTodos.filter(todo => !deletedIds.includes(todo.id)),
        );

        if (results.some(result => result.status === 'rejected')) {
          showError(ERROR_MESSAGES.DELETE);
        }

        inputRef.current?.focus();
      },
    );
  };

  const visibleTodos = useMemo(() => {
    return todosTest.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;

        case Filter.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todosTest, filter]);

  const activeTodosCount = useMemo(() => {
    return todosTest.filter(todo => !todo.completed).length;
  }, [todosTest]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todosTest}
          title={title}
          inputRef={inputRef}
          tempTodo={tempTodo}
          onTitleChange={setTitle}
          onSubmit={handleSubmit}
          handleToggle={handleToggle}
        />

        {(todosTest.length > 0 || tempTodo !== null) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            deletingTodoId={deletingTodoId}
            updatingTodoId={updatingTodoId}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        )}

        {todosTest.length > 0 && (
          <TodoFooter
            filter={filter}
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={todosTest.some(todo => todo.completed)}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
