/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { USER_ID, createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import { TodoElement } from './components/TodoElement';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);
  const [todoTitle, setTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedTodoId, setDeletedTodoId] = useState<number>(0);

  const inputAutoFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(todosData => {
        setTodos(todosData);
        setError('');
      })
      .catch(() => {
        setError('Unable to load todos');
      });

    const timeoutId = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    inputAutoFocus.current?.focus();
  }, [error, todos.length]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filterTodos = (filter: Filter): Todo[] => {
    switch (filter) {
      case Filter.All:
        return todos;

      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const filteredTodos = filterTodos(selectedFilter);

  const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
    setIsSubmitting(true);
    setTempTodo({ id: 0, title, userId, completed });

    return createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo] as Todo[]);
        setTodoTitle('');
        setError('');
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  const removeTodo = (todoId: number) => {
    setIsSubmitting(true);
    setDeletedTodoId(todoId);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(err => {
        setError('Unable to delete a todo');
        throw err;
      })
      .finally(() => {
        setIsSubmitting(false);
        setDeletedTodoId(0);
      });
  };

  const handleFromSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    addTodo({ title: trimmedTitle, userId: USER_ID, completed: false });
  };

  const todosCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  const handleClearCompletedClick = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      await Promise.all(completedTodos.map(todo => removeTodo(todo.id)));

      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleFromSubmit}>
            <input
              ref={inputAutoFocus}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={event => setTodoTitle(event?.target.value)}
              disabled={isSubmitting}
            />
          </form>
        </header>

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              isSubmitting={isSubmitting}
              deletedTodoId={deletedTodoId}
              handleRemoveTodo={removeTodo}
            />

            {tempTodo && (
              <TodoElement
                todo={tempTodo}
                deletedTodoId={deletedTodoId}
                handleRemoveTodo={removeTodo}
                isSubmitting={isSubmitting}
              />
            )}

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {todosCount} items left
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={classNames('filter__link', {
                    selected: selectedFilter === Filter.All,
                  })}
                  data-cy="FilterLinkAll"
                  onClick={() => setSelectedFilter(Filter.All)}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: selectedFilter === Filter.Active,
                  })}
                  data-cy="FilterLinkActive"
                  onClick={() => setSelectedFilter(Filter.Active)}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: selectedFilter === Filter.Completed,
                  })}
                  data-cy="FilterLinkCompleted"
                  onClick={() => setSelectedFilter(Filter.Completed)}
                >
                  Completed
                </a>
              </nav>
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!hasCompleted}
                onClick={handleClearCompletedClick}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {error}
      </div>
    </div>
  );
};
