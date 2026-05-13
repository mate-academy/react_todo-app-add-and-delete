import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoAppHeader } from './components/TodoAppHeader';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterStatus } from './types/FilterStatus';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const getFilterFromHash = (): FilterStatus => {
  if (window.location.hash === '#/active') {
    return FilterStatus.Active;
  }

  if (window.location.hash === '#/completed') {
    return FilterStatus.Completed;
  }

  return FilterStatus.All;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] =
    useState<FilterStatus>(getFilterFromHash);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const newTodoField = useRef<HTMLInputElement>(null);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const visibleTodos = useMemo(() => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return todos.filter(todo => !todo.completed);

      case FilterStatus.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [filterStatus, todos]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      });
  }, []);

  useEffect(() => {
    newTodoField.current?.focus();
  }, [isAdding]);

  useEffect(() => {
    if (!errorMessage) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [errorMessage]);

  const focusNewTodoField = () => {
    newTodoField.current?.focus();
  };

  const addLoadingTodoId = (todoId: number) => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);
  };

  const removeLoadingTodoId = (todoId: number) => {
    setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.Title);
      focusNewTodoField();

      return;
    }

    setErrorMessage('');
    setIsAdding(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo(trimmedTitle)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
        focusNewTodoField();
      });
  };

  const handleDelete = (todoId: number) => {
    setErrorMessage('');
    addLoadingTodoId(todoId);

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
        removeLoadingTodoId(todoId);
        focusNewTodoField();
      });
  };

  const handleToggle = (todoToUpdate: Todo) => {
    setErrorMessage('');
    addLoadingTodoId(todoToUpdate.id);

    updateTodo(todoToUpdate.id, { completed: !todoToUpdate.completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
      })
      .finally(() => {
        removeLoadingTodoId(todoToUpdate.id);
      });
  };

  const handleToggleAll = () => {
    const completed = activeTodosCount > 0;
    const todosToUpdate = todos.filter(todo => todo.completed !== completed);

    setErrorMessage('');

    todosToUpdate.forEach(todo => addLoadingTodoId(todo.id));

    Promise.all(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, { completed })
          .then(updatedTodo => {
            setTodos(currentTodos =>
              currentTodos.map(currentTodo =>
                currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
              ),
            );

            return true;
          })
          .catch(() => false)
          .finally(() => {
            removeLoadingTodoId(todo.id);
          }),
      ),
    ).then(results => {
      if (results.some(result => !result)) {
        setErrorMessage(ErrorMessage.Update);
      }
    });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setErrorMessage('');

    completedTodos.forEach(todo => addLoadingTodoId(todo.id));

    Promise.all(
      completedTodos.map(todo =>
        deleteTodo(todo.id)
          .then(() => {
            setTodos(currentTodos =>
              currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
            );

            return true;
          })
          .catch(() => false)
          .finally(() => {
            removeLoadingTodoId(todo.id);
          }),
      ),
    ).then(results => {
      if (results.some(result => !result)) {
        setErrorMessage(ErrorMessage.Delete);
      }

      focusNewTodoField();
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          hasTodos={todos.length > 0}
          allTodosCompleted={activeTodosCount === 0}
          inputRef={newTodoField}
          title={title}
          disabled={isAdding}
          onTitleChange={setTitle}
          onSubmit={handleSubmit}
          onToggleAll={handleToggleAll}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={tempTodo ? [...visibleTodos, tempTodo] : visibleTodos}
            loadingTodoIds={
              tempTodo ? [...loadingTodoIds, tempTodo.id] : loadingTodoIds
            }
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={hasCompletedTodos}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
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
