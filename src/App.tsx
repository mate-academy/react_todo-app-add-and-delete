/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { FILTERS, FilterType } from './constants/filters';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [filter, setFilter] = useState<FilterType>(FILTERS.all);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [nextId, setNextId] = useState<number>(1);
  const [adding, setAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [focusTick, setFocusTick] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showError = (message: string) => {
    setError(message);
    setNotificationVisible(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setNotificationVisible(false);
    }, 3000);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setNotificationVisible(false);
      setError('');

      try {
        const data = await getTodos();

        setTodos(data);
        const maxId = data.reduce(
          (max: number, t: { id: number }) => Math.max(max, t.id),
          0,
        );

        setNextId(maxId + 1);
      } catch (e) {
        if (e instanceof Error && e.message.trim() !== '') {
          showError(e.message);
        } else {
          showError('Unable to load todos');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case FILTERS.active:
        return !todo.completed;
      case FILTERS.completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const allCompleted = todos.length > 0 && todos.every(t => t.completed);

  const handleAdd = async (rawTitle: string): Promise<boolean> => {
    const title = rawTitle.trim();

    if (!title) {
      showError('Title should not be empty');

      return false;
    }

    setAdding(true);
    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    try {
      const created = await createTodo(title);

      setTodos(prev => [...prev, created]);

      return true;
    } catch (e) {
      showError('Unable to add a todo');

      return false;
    } finally {
      setTempTodo(null);
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingIds(prev => new Set(prev).add(id));

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      showError('Unable to delete a todo');
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);

        next.delete(id);

        return next;
      });
      setFocusTick(t => t + 1);
    }
  };

  const handleClearCompleted = async () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id);

    if (completedIds.length === 0) {
      return;
    }

    setDeletingIds(prev => {
      const next = new Set(prev);

      completedIds.forEach(id => next.add(id));

      return next;
    });

    const results = await Promise.allSettled(
      completedIds.map(async id => {
        try {
          await deleteTodo(id);
          setTodos(prev => prev.filter(t => t.id !== id));

          return { id, ok: true };
        } catch (e) {
          return { id, ok: false };
        } finally {
          setDeletingIds(prev => {
            const next = new Set(prev);

            next.delete(id);

            return next;
          });
        }
      }),
    );

    const anyFailed = results.some(r =>
      r.status === 'fulfilled' ? !r.value.ok : true,
    );

    if (anyFailed) {
      showError('Unable to delete a todo');
    }

    setFocusTick(t => t + 1);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', { active: allCompleted })}
            data-cy="ToggleAllButton"
          />

          <NewTodo
            disabled={adding}
            onSubmit={handleAdd}
            focusTick={focusTick}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {loading && (
            <div className="modal overlay is-active" data-cy="Loader">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}

          <TodoList
            todos={visibleTodos}
            loadingIds={deletingIds}
            onDelete={handleDelete}
          />
          {tempTodo && (
            <TodoList
              todos={[tempTodo]}
              loadingIds={new Set([0])}
              onDelete={undefined}
            />
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            <Filter current={filter} onChange={setFilter} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.every(t => !t.completed)}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !notificationVisible },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setNotificationVisible(false)}
        />
        {error}
      </div>
    </div>
  );
};
