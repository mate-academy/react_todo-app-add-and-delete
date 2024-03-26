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

  const inputAutoFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputAutoFocus.current?.focus();

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

    createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo] as Todo[]);
        setTodoTitle('');
        setError('');
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        inputAutoFocus.current?.focus();
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  const removeTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError('Unable to delete a todo');
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
              handleRemoveTodo={removeTodo}
            />

            {tempTodo && (
              <TodoElement
                todo={tempTodo}
                handleRemoveTodo={removeTodo}
                isSubmitting={isSubmitting}
              />
            )}

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {todos.filter(todo => !todo.completed).length} items left
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
