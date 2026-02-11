/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import cn from 'classnames';
import { ERROR_DISPLAY_DURATION, TEMP_TODO_ID } from './constants';
import { USER_ID, addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { t, getNoun } from './utils/phrases';
import { UserWarning } from './UserWarning';
import { Filter, FilterType } from './types/FilterType';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Partial<Todo> | null>(null);
  const [filter, setFilter] = useState<FilterType>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(t('error.loadFailed')));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timerId = setTimeout(() => {
        setErrorMessage('');
      }, ERROR_DISPLAY_DURATION);

      return () => clearTimeout(timerId);
    }

    return undefined;
  }, [errorMessage]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        case Filter.All:
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const allCompleted = todos.length > 0 && activeTodosCount === 0;

  useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  }, []);

  const onAdd = (title: string) => {
    if (!input.current || tempTodo) {
      return;
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle) {
      input.current.disabled = true;

      setTempTodo({
        id: TEMP_TODO_ID,
        title: trimmedTitle,
        completed: false,
      });

      addTodo(trimmedTitle)
        .then(newTodo => {
          setTodos(prevTodos => [...prevTodos, newTodo]);

          if (input.current) {
            input.current.value = '';
          }
        })
        .catch(() => setErrorMessage(t('error.addFailed')))
        .finally(() => {
          if (input.current) {
            input.current.disabled = false;
            input.current.focus();
          }

          setTempTodo(null);
        });
    } else {
      setErrorMessage(t('error.emptyTitle'));
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input.current) {
      onAdd(input.current.value);
    }
  };

  const onDelete = (id: number) => {
    setDeletingIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => setErrorMessage(t('error.deleteFailed')))
      .finally(() => {
        setDeletingIds(prev => prev.filter(todoId => todoId !== id));
        input.current?.focus();
      });
  };

  const onDeleteCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setDeletingIds(prev => [...prev, ...completedIds]);

    let errorCount = 0;

    Promise.allSettled(
      completedTodos.map(todo =>
        deleteTodo(todo.id)
          .then(() => {
            setTodos(prevTodos => prevTodos.filter(td => td.id !== todo.id));
          })
          .catch(() => {
            errorCount++;
          })
          .finally(() => {
            setDeletingIds(prev => prev.filter(id => id !== todo.id));
          }),
      ),
    ).then(() => {
      if (errorCount > 0) {
        if (errorCount === completedTodos.length) {
          setErrorMessage(t('error.deleteFailed'));
        } else {
          const nounText = getNoun(errorCount, 'noun.todo', 'noun.todos');

          setErrorMessage(
            t('error.bulkDeleteFailed', { count: errorCount, noun: nounText }),
          );
        }
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">{t('header.title')}</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: allCompleted,
            })}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleFormSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder={t('input.placeholder')}
              ref={input}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            onDelete={onDelete}
            tempTodo={tempTodo}
            deletingIds={deletingIds}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            completedTodosCount={todos.length - activeTodosCount}
            filter={filter}
            onFilterChange={setFilter}
            onDeleteCompleted={onDeleteCompleted}
          />
        )}
      </div>

      <ErrorNotification
        error={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
