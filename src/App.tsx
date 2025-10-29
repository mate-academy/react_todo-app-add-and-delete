import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { ERROR_TEXT } from './constants';
import { Filters } from './types/Filters';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { NewTodoForm } from './components/NewTodoForm';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  // states
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filters>(Filters.all);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  // clears error
  const hideError = () => {
    setErrorMessage('');
  };

  // auto-hide error after 3 seconds
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const t = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(t);
  }, [errorMessage]);

  // load todos on mount
  useEffect(() => {
    hideError();
    setIsLoading(true);
    getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => setErrorMessage(ERROR_TEXT.load))
      .finally(() => setIsLoading(false));
  }, []);

  // count active todos
  const itemsLeft = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos],
  );

  const hasTodos = todos.length > 0;
  const hasCompleted = useMemo(() => todos.some(t => t.completed), [todos]);
  const allCompleted = hasTodos && itemsLeft === 0;

  // filtered list of todos
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filters.active:
        return todos.filter(t => !t.completed);
      case Filters.completed:
        return todos.filter(t => t.completed);
      case Filters.all:
        return todos;
    }
  }, [todos, filter]);

  // add todo
  const handleAddTodo = async () => {
    const title = newTitle.trim();

    if (!title) {
      setErrorMessage(ERROR_TEXT.emptyTitle);

      return;
    }

    hideError();
    setIsAdding(true);

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temp);

    try {
      const created = await createTodo(title);

      setTodos(prev => [...prev, created]);
      setNewTitle('');
    } catch {
      setErrorMessage(ERROR_TEXT.add);
    } finally {
      setTempTodo(null);
      setIsAdding(false);

      //keep input focused
      document
        .querySelector<HTMLInputElement>('[data-cy="NewTodoField"]')
        ?.focus();
    }
  };

  // delete single todo
  const handleDelete = async (id: number) => {
    hideError();
    // add to set to show loader
    setDeletingIds(prev => {
      const copy = new Set(prev);

      copy.add(id);

      return copy;
    });

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      document
        .querySelector<HTMLInputElement>('[data-cy="NewTodoField"]')
        ?.focus();
    } catch {
      setErrorMessage(ERROR_TEXT.delete);
    } finally {
      setDeletingIds(prev => {
        const copy = new Set(prev);

        copy.delete(id);

        return copy;
      });
    }
  };

  // clear completed todos
  const handleClearCompleted = async () => {
    const ids = todos.filter(todo => todo.completed).map(todo => todo.id);

    hideError();
    setIsClearing(true);

    // marking all as deleting
    setDeletingIds(prev => {
      const copy = new Set(prev);

      ids.forEach(id => copy.add(id));

      return copy;
    });

    // list of deletes for  parallel deleting
    const deletions = ids.map(async id => {
      try {
        await deleteTodo(id);
        setTodos(prev => prev.filter(todo => todo.id !== id));

        return { id, ok: true };
      } catch {
        return { id, ok: false };
      } finally {
        setDeletingIds(prev => {
          const copy = new Set(prev);

          copy.delete(id);

          return copy;
        });
      }
    });

    const results = await Promise.allSettled(deletions);
    const anyFailed = results.some(
      result =>
        (result.status === 'fulfilled' && !result.value.ok) ||
        result.status === 'rejected',
    );

    if (anyFailed) {
      setErrorMessage(ERROR_TEXT.delete);
    }

    setIsClearing(false);

    if (!anyFailed) {
      document
        .querySelector<HTMLInputElement>('[data-cy="NewTodoField"]')
        ?.focus();
    }
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
          <button
            type="button"
            className={cn('todoapp__toggle-all', { active: allCompleted })}
            data-cy="ToggleAllButton"
            disabled={!hasTodos}
          />

          <NewTodoForm
            value={newTitle}
            onChange={setNewTitle}
            onSubmit={handleAddTodo}
            disabled={isAdding || isLoading}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          deletingIds={deletingIds}
          onDelete={handleDelete}
        />

        <TransitionGroup>
          {tempTodo && (
            <CSSTransition key="temp" timeout={300} classNames="item">
              <TodoItem todo={tempTodo} isBusy />
            </CSSTransition>
          )}
        </TransitionGroup>

        {hasTodos && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {itemsLeft} items left
            </span>

            <Filter value={filter} onChange={setFilter} />
            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={!hasCompleted || isClearing}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification message={errorMessage} onHide={hideError} />
    </div>
  );
};
