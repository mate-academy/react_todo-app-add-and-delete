/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID, posttTodo, delTodos, patchTodo } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { TodoHeader } from './components/TodoHeader';
import { TodoSection } from './components/TodoSection';
import { TodoButtons } from './components/TodoButtons';

type FilterStatus = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const visibleTodos = useMemo(() => {
    if (filter === 'active') {
      return todos.filter(todo => !todo.completed);
    }

    if (filter === 'completed') {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }, [todos, filter]);

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  function showError(message: string) {
    setError(message);

    setTimeout(() => {
      setError('');
    }, 3000);
  }

  function updateTodo(
    todo: Todo,
    changes: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) {
    setError('');
    setLoadingTodoIds(ids => [...ids, todo.id]);

    patchTodo(todo.id, changes)
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );

        setEditingTodoId(null);
      })
      .catch(() => {
        showError('Unable to update a todo');
      })
      .finally(() => {
        setLoadingTodoIds(ids => ids.filter(id => id !== todo.id));
      });
  }

  function addTodo(title: string) {
    setError('');
    setIsAdding(true);

    const tempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTodos(prev => [...prev, tempTodo]);

    posttTodo(title)
      .then(newTodo => {
        setTodos(prev => prev.map(todo => (todo.id === 0 ? newTodo : todo)));
        setQuery('');
      })
      .catch(() => {
        setTodos(prev => prev.filter(todo => todo.id !== 0));
        showError('Unable to add a todo');
      })
      .finally(() => {
        setIsAdding(false);
      });
  }

  function deletTodo(todoId: number) {
    setError('');
    setLoadingTodoIds(ids => [...ids, todoId]);

    delTodos(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        showError('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodoIds(ids => ids.filter(id => id !== todoId));
      });
  }

  function clearCompleted() {
    setError('');

    const completedTodos = todos.filter(todo => todo.completed);

    setLoadingTodoIds(ids => [...ids, ...completedTodos.map(todo => todo.id)]);

    completedTodos.forEach(todo => {
      delTodos(todo.id)
        .then(() => {
          setTodos(current => current.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          showError('Unable to delete a todo');
        })
        .finally(() => {
          setLoadingTodoIds(ids => ids.filter(id => id !== todo.id));
        });
    });
  }

  function handleToggle(todo: Todo) {
    updateTodo(todo, { completed: !todo.completed });
  }

  function allComplited() {
    if (!allCompleted) {
      const noCompletedTodos = todos.filter(todo => !todo.completed);

      noCompletedTodos.forEach(todo => {
        handleToggle(todo);
      });
    } else {
      todos.forEach(todo => {
        handleToggle(todo);
      });
    }
  }

  function handleEditStart(todo: Todo) {
    setEditingTodoId(todo.id);
    setQuery(todo.title);
  }

  function handleRenameSubmit(
    event: React.FormEvent | React.FocusEvent,
    todo: Todo,
  ) {
    event.preventDefault();

    const newTitle = query.trim();

    if (!newTitle) {
      deletTodo(todo.id);

      return;
    }

    if (newTitle === todo.title) {
      setEditingTodoId(null);

      return;
    }

    updateTodo(todo, { title: newTitle });
  }

  useEffect(() => {
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        showError('Unable to load todos');
        setTodos([]);
      });
  }, []);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    if (!isAdding && loadingTodoIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [isAdding, loadingTodoIds]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = query.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    addTodo(trimmedTitle);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          allCompleted={allCompleted}
          onToggleAll={allComplited}
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
          isAdding={isAdding}
          inputRef={inputRef}
        />

        <TodoSection
          visibleTodos={visibleTodos}
          handleToggle={handleToggle}
          editingTodoId={editingTodoId}
          handleEditStart={handleEditStart}
          deletTodo={deletTodo}
          handleRenameSubmit={handleRenameSubmit}
          query={query}
          onQueryChange={setQuery}
          onEditingTodoId={setEditingTodoId}
          loadingTodoIds={loadingTodoIds}
        />

        <TodoButtons
          todos={todos}
          filter={filter}
          onFilterChange={setFilter}
          onClearCompleted={clearCompleted}
        />
      </div>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
