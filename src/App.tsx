import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Filter } from './types/Filter';
import { TempTodo } from './types/TempTodo';
import { Todo } from './types/Todo';

const TEMP_TODO_ID = 0;

const getFilterFromHash = (): Filter => {
  switch (window.location.hash) {
    case '#/active':
      return 'active';

    case '#/completed':
      return 'completed';

    default:
      return 'all';
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(getFilterFromHash);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const newTodoField = useRef<HTMLInputElement>(null);
  const editTodoField = useRef<HTMLInputElement>(null);
  const errorTimerId = useRef<number | null>(null);

  const hideError = React.useCallback(() => {
    setErrorMessage('');

    if (errorTimerId.current) {
      window.clearTimeout(errorTimerId.current);
      errorTimerId.current = null;
    }
  }, []);

  const showError = React.useCallback(
    (message: string) => {
      hideError();
      setErrorMessage(message);

      errorTimerId.current = window.setTimeout(() => {
        setErrorMessage('');
        errorTimerId.current = null;
      }, 3000);
    },
    [hideError],
  );

  const markTodoAsLoading = (todoId: number) => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);
  };

  const unmarkTodoAsLoading = (todoId: number) => {
    setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
  };

  useEffect(() => {
    const handleHashChange = () => setFilter(getFilterFromHash());

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    hideError();

    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));

    return () => {
      if (errorTimerId.current) {
        window.clearTimeout(errorTimerId.current);
      }
    };
  }, [hideError, showError]);

  useEffect(() => {
    newTodoField.current?.focus();
  }, [todos.length, tempTodo, errorMessage]);

  useEffect(() => {
    editTodoField.current?.focus();
  }, [editingTodoId]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case 'active':
          return !todo.completed;

        case 'completed':
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filter]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.length - activeTodosCount;
  const allTodosCompleted = todos.length > 0 && activeTodosCount === 0;
  const isAdding = Boolean(tempTodo);

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    hideError();
    setTempTodo({
      id: TEMP_TODO_ID,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo(trimmedTitle)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setNewTodoTitle('');
      })
      .catch(() => showError('Unable to add a todo'))
      .finally(() => setTempTodo(null));
  };

  const handleDeleteTodo = (todoId: number) => {
    hideError();
    markTodoAsLoading(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => unmarkTodoAsLoading(todoId));
  };

  const handleUpdateTodo = (todoToUpdate: Todo, data: Partial<Todo>) => {
    hideError();
    markTodoAsLoading(todoToUpdate.id);

    return updateTodo(todoToUpdate.id, data)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === todoToUpdate.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        showError('Unable to update a todo');
      })
      .finally(() => unmarkTodoAsLoading(todoToUpdate.id));
  };

  const handleToggleTodo = (todo: Todo) => {
    void handleUpdateTodo(todo, { completed: !todo.completed });
  };

  const handleToggleAll = () => {
    const nextCompleted = !allTodosCompleted;
    const todosToUpdate = todos.filter(
      todo => todo.completed !== nextCompleted,
    );

    todosToUpdate.forEach(todo => {
      void handleUpdateTodo(todo, { completed: nextCompleted });
    });
  };

  const startEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const stopEditing = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const handleRenameTodo = (todo: Todo) => {
    const trimmedTitle = editingTitle.trim();

    if (!trimmedTitle) {
      handleDeleteTodo(todo.id);
      stopEditing();

      return;
    }

    if (trimmedTitle === todo.title) {
      stopEditing();

      return;
    }

    void handleUpdateTodo(todo, { title: trimmedTitle }).then(() => {
      stopEditing();
    });
  };

  const handleClearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        handleDeleteTodo(todo.id);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosCount={todos.length}
          allTodosCompleted={allTodosCompleted}
          newTodoTitle={newTodoTitle}
          isAdding={isAdding}
          newTodoField={newTodoField}
          onToggleAll={handleToggleAll}
          onAddTodo={handleAddTodo}
          onNewTodoTitleChange={setNewTodoTitle}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            editingTodoId={editingTodoId}
            editingTitle={editingTitle}
            editTodoField={editTodoField}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            onStartEditing={startEditing}
            onRenameTodo={handleRenameTodo}
            onEditingTitleChange={setEditingTitle}
            onCancelEditing={stopEditing}
          />
        )}

        {todos.length > 0 && (
          <Footer
            filter={filter}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} onHideError={hideError} />
    </div>
  );
};
