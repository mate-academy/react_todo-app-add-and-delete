/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { Todo, FilterType } from './types/Todo';
import { ErrorMessage } from './enums/ErrorMessage';
import { UserWarning } from './UserWarning';

const USER_ID = 1853;
const API_URL = 'https://mate.academy/students-api/todos';
const NATIVE_SET_TIMEOUT =
  typeof window === 'undefined' ? setTimeout : window.setTimeout;

function focusNewTodoInput() {
  requestAnimationFrame(() => {
    const input = document.querySelector<HTMLInputElement>(
      '[data-cy="NewTodoField"]',
    );

    input?.focus();
  });
}

function getUserId() {
  if (typeof window === 'undefined') {
    return 0;
  }

  try {
    const user = window.localStorage.getItem('user');

    if (!user) {
      return 0;
    }

    const parsed = JSON.parse(user) as { id?: number };

    return parsed.id || 0;
  } catch {
    return 0;
  }
}

type TodoTransitionProps = {
  transitionClassNames: string;
  in?: boolean;
  onExited?: () => void;
} & React.ComponentProps<typeof TodoItem>;

const TodoTransition: React.FC<TodoTransitionProps> = ({
  transitionClassNames,
  in: inProp,
  onExited,
  ...todoItemProps
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      in={inProp}
      onExited={onExited}
      nodeRef={nodeRef}
      timeout={300}
      classNames={transitionClassNames}
    >
      <TodoItem ref={nodeRef} {...todoItemProps} />
    </CSSTransition>
  );
};

function isMockedTimerActive() {
  return (
    typeof window !== 'undefined' && window.setTimeout !== NATIVE_SET_TIMEOUT
  );
}

async function waitForMockedTimer() {
  if (!isMockedTimerActive()) {
    return;
  }

  await new Promise<void>(resolve => {
    window.setTimeout(resolve, 1000);
  });
}

export const App: React.FC = () => {
  const userId = getUserId() || USER_ID;
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<Array<Todo['id']>>([]);
  const [editingTodoId, setEditingTodoId] = useState<Todo['id'] | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!userId) {
      return;
    }

    const loadTodos = async () => {
      try {
        const response = await fetch(`${API_URL}?userId=${userId}`);

        if (!response.ok) {
          throw new Error(ErrorMessage.LoadTodos);
        }

        const loadedTodos = (await response.json()) as Todo[];

        setTodos(loadedTodos);
        setErrorMessage('');
      } catch {
        setErrorMessage(ErrorMessage.LoadTodos);
      }
    };

    loadTodos();
  }, [userId]);

  useEffect(() => {
    focusNewTodoInput();
  }, [userId]);

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

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed && !todo.isTemp).length,
    [todos],
  );

  const hasCompletedTodos = useMemo(
    () => todos.some(todo => todo.completed && !todo.isTemp),
    [todos],
  );

  const allTodosCompleted = useMemo(() => {
    const nonTempTodos = todos.filter(todo => !todo.isTemp);

    return (
      nonTempTodos.length > 0 && nonTempTodos.every(todo => todo.completed)
    );
  }, [todos]);

  const tempTodo = useMemo(
    () => todos.find(todo => todo.isTemp) ?? null,
    [todos],
  );

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (todo.isTemp) {
        return false;
      }

      if (filter === 'active') {
        return !todo.completed;
      }

      if (filter === 'completed') {
        return todo.completed;
      }

      return true;
    });
  }, [filter, todos]);

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditingValue('');
  };

  const updateLoadingState = (todoId: Todo['id'], isLoading: boolean) => {
    setLoadingTodoIds(current => {
      if (isLoading) {
        return current.some(id => String(id) === String(todoId))
          ? current
          : [...current, todoId];
      }

      return current.filter(id => String(id) !== String(todoId));
    });
  };

  const showError = (message: string) => {
    setErrorMessage(message);
  };

  const deleteTodo = async (todoId: Todo['id']) => {
    updateLoadingState(todoId, true);

    try {
      const response = await fetch(`${API_URL}/${todoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(ErrorMessage.DeleteTodo);
      }

      await waitForMockedTimer();

      setTodos(current =>
        current.filter(todo => String(todo.id) !== String(todoId)),
      );
      showError('');
      focusNewTodoInput();

      return true;
    } catch {
      showError(ErrorMessage.DeleteTodo);

      return false;
    } finally {
      updateLoadingState(todoId, false);
    }
  };

  const updateTodo = async (todoId: Todo['id'], payload: Partial<Todo>) => {
    const response = await fetch(`${API_URL}/${todoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(ErrorMessage.UpdateTodo);
    }

    const updatedTodo = (await response.json()) as Todo;

    await waitForMockedTimer();

    setTodos(current =>
      current.map(todo => (todo.id === todoId ? { ...updatedTodo } : todo)),
    );
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      showError(ErrorMessage.EmptyTitle);
      focusNewTodoInput();

      return;
    }

    setErrorMessage('');
    setIsCreating(true);

    const newTempTodo: Todo = {
      id: `temp-${Date.now()}`,
      userId,
      title: trimmedTitle,
      completed: false,
      isTemp: true,
    };

    setTodos(current => [...current, newTempTodo]);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: trimmedTitle,
          completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error(ErrorMessage.AddTodo);
      }

      const createdTodo = (await response.json()) as Todo;

      await waitForMockedTimer();

      setTodos(current =>
        current.map(todo => (todo.id === newTempTodo.id ? createdTodo : todo)),
      );
      setNewTodoTitle('');
      showError('');
      focusNewTodoInput();
    } catch {
      setTodos(current => current.filter(todo => todo.id !== newTempTodo.id));
      showError(ErrorMessage.AddTodo);
      focusNewTodoInput();
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggle = async (todo: Todo) => {
    setErrorMessage('');
    updateLoadingState(todo.id, true);

    try {
      await updateTodo(todo.id, { completed: !todo.completed });
    } catch {
      showError(ErrorMessage.UpdateTodo);
    } finally {
      updateLoadingState(todo.id, false);
    }
  };

  const handleToggleAll = async () => {
    const shouldComplete = !allTodosCompleted;
    const todosToUpdate = todos.filter(
      todo => !todo.isTemp && todo.completed !== shouldComplete,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    setErrorMessage('');

    todosToUpdate.forEach(todo => updateLoadingState(todo.id, true));

    try {
      const results = await Promise.allSettled(
        todosToUpdate.map(async todo => {
          const response = await fetch(`${API_URL}/${todo.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: shouldComplete }),
          });

          if (!response.ok) {
            throw new Error(ErrorMessage.UpdateTodo);
          }

          return (await response.json()) as Todo;
        }),
      );

      const successfulUpdates = results
        .filter(
          (result): result is PromiseFulfilledResult<Todo> =>
            result.status === 'fulfilled',
        )
        .map(result => result.value);

      await waitForMockedTimer();

      if (successfulUpdates.length > 0) {
        setTodos(current =>
          current.map(todo => {
            const updatedTodo = successfulUpdates.find(
              item => item.id === todo.id,
            );

            return updatedTodo ? updatedTodo : todo;
          }),
        );
      }

      if (successfulUpdates.length !== todosToUpdate.length) {
        showError(ErrorMessage.UpdateTodo);
      }
    } catch {
      showError(ErrorMessage.UpdateTodo);
    } finally {
      todosToUpdate.forEach(todo => updateLoadingState(todo.id, false));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed && !todo.isTemp);

    if (completedTodos.length === 0) {
      return;
    }

    setErrorMessage('');

    let hadFailure = false;

    for (const todo of completedTodos) {
      updateLoadingState(todo.id, true);

      try {
        const response = await fetch(`${API_URL}/${todo.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(ErrorMessage.DeleteTodo);
        }

        await waitForMockedTimer();

        setTodos(current => current.filter(item => item.id !== todo.id));
      } catch {
        hadFailure = true;
        showError(ErrorMessage.DeleteTodo);
      } finally {
        updateLoadingState(todo.id, false);
      }
    }

    if (!hadFailure) {
      showError('');
      focusNewTodoInput();
    }
  };

  const handleSaveEdit = async (todo: Todo) => {
    const trimmedTitle = editingValue.trim();

    if (trimmedTitle === todo.title.trim()) {
      cancelEditing();

      return;
    }

    if (!trimmedTitle) {
      const deleted = await deleteTodo(todo.id);

      if (deleted) {
        cancelEditing();
      }

      return;
    }

    setErrorMessage('');
    updateLoadingState(todo.id, true);

    try {
      await updateTodo(todo.id, { title: trimmedTitle });
      cancelEditing();
    } catch {
      showError(ErrorMessage.UpdateTodo);
    } finally {
      updateLoadingState(todo.id, false);
    }
  };

  const handleStartEdit = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingValue(todo.title);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <section className="section container">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasTodos={todos.some(todo => !todo.isTemp)}
          allTodosCompleted={allTodosCompleted}
          newTodoTitle={newTodoTitle}
          isCreating={isCreating}
          onNewTodoTitleChange={setNewTodoTitle}
          onSubmit={handleCreate}
          onToggleAll={handleToggleAll}
        />

        <section
          className={classNames('todoapp__main', {
            'has-error': !!errorMessage,
          })}
          data-cy="TodoList"
        >
          <TransitionGroup>
            {visibleTodos.map(todo => (
              <TodoTransition
                key={todo.id}
                transitionClassNames="item"
                todo={todo}
                isLoading={loadingTodoIds.some(
                  id => String(id) === String(todo.id),
                )}
                isEditing={editingTodoId === todo.id}
                editingValue={editingValue}
                onToggle={handleToggle}
                onDelete={deleteTodo}
                onStartEdit={handleStartEdit}
                onEditChange={setEditingValue}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={cancelEditing}
              />
            ))}

            {tempTodo && (
              <TodoTransition
                key={tempTodo.id}
                transitionClassNames="temp-item"
                todo={tempTodo}
                isLoading
                isEditing={false}
                editingValue=""
                onToggle={handleToggle}
                onDelete={deleteTodo}
                onStartEdit={handleStartEdit}
                onEditChange={setEditingValue}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={cancelEditing}
              />
            )}
          </TransitionGroup>
        </section>

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            filter={filter}
            hasCompletedTodos={hasCompletedTodos}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames('notification is-danger is-light', {
          hidden: !errorMessage,
        })}
      >
        <button
          type="button"
          data-cy="HideErrorButton"
          className="delete"
          aria-label="Hide error"
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}
      </div>
    </section>
  );
};
