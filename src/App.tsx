/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { TodoItem } from './components/TodoItem';
import { getTodos, addTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

enum ErrorMessage {
  LoadTodos = 'Unable to load todos',
  EmptyTitle = 'Title should not be empty',
  AddTodo = 'Unable to add a todo',
  DeleteTodo = 'Unable to delete a todo',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState<FilterStatus>(FilterStatus.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);
  const deletingIdsSet = useMemo(() => new Set(deletingIds), [deletingIds]);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LoadTodos);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (!isAdding && deletingIds.length === 0) {
      newTodoFieldRef.current?.focus();
    }
  }, [isAdding, deletingIds.length]);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setIsAdding(true);
    setTempTodo(newTempTodo);

    try {
      const createdTodo = await addTodo(USER_ID, trimmedTitle);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTitle('');
    } catch {
      setErrorMessage(ErrorMessage.AddTodo);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
        setDeletingIds(current =>
          current.includes(todoId) ? current : [...current, todoId],
        );

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorMessage.DeleteTodo);
    } finally {
      setDeletingIds(current => current.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (!completedTodos.length) {
      return;
    }

    const completedIds = completedTodos.map(todo => todo.id);

    setDeletingIds(current => [
      ...current,
      ...completedIds.filter(id => !current.includes(id)),
    ]);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successfulIds = completedTodos
      .filter((_, index) => results[index].status === 'fulfilled')
      .map(todo => todo.id);
    const hasError = results.some(result => result.status === 'rejected');

    if (successfulIds.length) {
      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulIds.includes(todo.id)),
      );
    }

    if (hasError) {
      setErrorMessage(ErrorMessage.DeleteTodo);
    }

    setDeletingIds(current => current.filter(id => !completedIds.includes(id)));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filterBy === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filterBy === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodos = todos.filter(todo => !todo.completed);

  const filterLinks = [
    {
      href: '#/',
      value: FilterStatus.All,
      label: 'All',
      dataCy: 'FilterLinkAll',
    },
    {
      href: '#/active',
      value: FilterStatus.Active,
      label: 'Active',
      dataCy: 'FilterLinkActive',
    },
    {
      href: '#/completed',
      value: FilterStatus.Completed,
      label: 'Completed',
      dataCy: 'FilterLinkCompleted',
    },
  ];

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleAddTodo}>
            <input
              ref={newTodoFieldRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isLoading={deletingIdsSet.has(todo.id)}
                onDelete={handleDeleteTodo}
              />
            ))}
            {tempTodo && (
              <TodoItem todo={tempTodo} isLoading isDeleteDisabled />
            )}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos.length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              {filterLinks.map(link => (
                <a
                  key={link.value}
                  href={link.href}
                  className={
                    filterBy === link.value
                      ? 'filter__link selected'
                      : 'filter__link'
                  }
                  data-cy={link.dataCy}
                  onClick={() => setFilterBy(link.value)}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={!todos.some(todo => todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          errorMessage ? '' : 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
