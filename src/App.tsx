import React, { useEffect, useState, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { Header } from './components/header';
import { TodoList } from './components/todolist';
import { Footer } from './components/footer';
import { ErrorNotification } from './components/error';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './enums/filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [savingIds, setSavingIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimeoutRef = useRef<number>();

  const showError = useCallback((msg: string) => {
    clearTimeout(errorTimeoutRef.current);
    setErrorMsg(null);
    setTimeout(() => setErrorMsg(msg), 0);
    errorTimeoutRef.current = window.setTimeout(() => {
      setErrorMsg(null);
      setTempTodo(null);
    }, 3000);
  }, []);

  const clearError = useCallback(() => {
    clearTimeout(errorTimeoutRef.current);
    setErrorMsg(null);
  }, []);

  const loadTodos = useCallback(async () => {
    clearError();
    setLoading(true);
    try {
      const response = await getTodos();

      setTodos(response);
    } catch {
      showError('Unable to load todos');
    } finally {
      setLoading(false);
    }
  }, [clearError, showError]);

  useEffect(() => {
    if (USER_ID) {
      loadTodos();
    }

    inputRef.current?.focus();
  }, [loadTodos]);

  useEffect(() => {
    if (!tempTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo]);

  const handleAddTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });
    setLoading(true);

    try {
      const newTodo = await addTodo(trimmedTitle);

      setTodos(prev => [...prev, newTodo]);
      setNewTitle('');
      setTempTodo(null);
      inputRef.current?.focus();
    } catch {
      showError('Unable to add a todo');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTodo = async (id: number) => {
    clearError();
    setSavingIds(ids => [...ids, id]);
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
      inputRef.current?.focus();
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setSavingIds(ids => ids.filter(i => i !== id));
    }
  };

  const handleClearCompleted = async () => {
    clearError();
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setSavingIds(ids => [...ids, ...completedIds]);

    const results = await Promise.allSettled(
      completedIds.map(id => deleteTodo(id)),
    );

    let hasFailed = false;

    const successfulIds = completedIds.filter((_, index) => {
      const success = results[index].status === 'fulfilled';

      if (!success) {
        hasFailed = true;
      }

      return success;
    });

    if (hasFailed) {
      showError('Unable to delete a todo');
    }

    if (successfulIds.length > 0) {
      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));
    }

    setSavingIds(ids => ids.filter(id => !completedIds.includes(id)));

    inputRef.current?.focus();
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterType.Active) {
      return !todo.completed;
    }

    if (filter === FilterType.Completed) {
      return todo.completed;
    }

    return true;
  });

  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="todoapp">
      {!USER_ID ? (
        <div>Please register user first</div>
      ) : (
        <>
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            <Header
              allCompleted={false}
              onToggleAll={() => {}}
              newTitle={newTitle}
              setNewTitle={setNewTitle}
              onAddTodo={handleAddTodo}
              clearError={clearError}
              inputRef={inputRef}
              disabled={!!tempTodo}
            />

            {(todos.length > 0 || tempTodo) && (
              <>
                <TodoList
                  todos={[...filteredTodos, ...(tempTodo ? [tempTodo] : [])]}
                  savingIds={savingIds}
                  editingId={null}
                  editingTitle={''}
                  onToggleTodo={() => {}}
                  onRemoveTodo={handleRemoveTodo}
                  onStartEdit={() => {}}
                  onSaveEdit={() => {}}
                  setEditingTitle={() => {}}
                  tempTodoId={tempTodo ? 0 : null}
                />

                <Footer
                  activeCount={activeCount}
                  completedCount={completedCount}
                  filter={filter}
                  setFilter={setFilter}
                  onClearCompleted={handleClearCompleted}
                />
              </>
            )}
          </div>

          <ErrorNotification
            errorMsg={errorMsg}
            onClose={() => setErrorMsg(null)}
          />

          <div
            data-cy="LoadingOverlay"
            className={classNames('modal overlay', { 'is-active': loading })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
