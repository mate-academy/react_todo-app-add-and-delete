/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { Form } from './Form';

export const App: React.FC = () => {
  // todos
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');
  const [todosError, setTodosError] = useState('');
  const [isLoadingIds, setIsLoadingIds] = useState<number[]>([]);

  // add / delete
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  //onMount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await getTodos();

        setTodos(response);
      } catch (err) {
        setTodosError('Unable to load todos');
      } finally {
      }
    };

    fetchTodos();
  }, []);

  //hide error messages after 3s
  useEffect(() => {
    if (!todosError) {
      return;
    }

    const timer = setTimeout(() => {
      setTodosError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [todosError]);

  // visible todos
  const filteredTodos = useMemo(() => {
    if (filter === 'Active') {
      return todos.filter(todo => !todo.completed);
    }

    if (filter === 'Completed') {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }, [filter, todos]);

  const handleSubmit = async (value: string): Promise<boolean> => {
    setTodosError('');

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      setTodosError('Title should not be empty');

      return false;
    }

    try {
      const todo = {
        completed: false,
        userId: USER_ID,
        title: trimmed,
      };

      setTempTodo({ ...todo, id: 0 });
      const response = await addTodo(todo);

      setTodos(prev => [...prev, response]);

      return true;
    } catch (error) {
      setTodosError('Unable to add a todo');

      return false;
    } finally {
      setTempTodo(null);
    }
  };

  const handleDelete = async (todoId: number) => {
    try {
      setIsLoadingIds(prev => [...prev, todoId]);
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      setTodosError('Unable to delete a todo');
    } finally {
      setIsLoadingIds(prev => prev.filter(id => id !== todoId));
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setIsLoadingIds(prev => [...prev, ...completedIds]);

    const results = await Promise.allSettled(
      completedIds.map(id => deleteTodo(id)),
    );

    const deletedIds = completedIds.filter(
      (_, index) => results[index].status === 'fulfilled',
    );

    if (deletedIds.length !== completedIds.length) {
      setTodosError('Unable to delete a todo');
    }

    setTodos(prev => prev.filter(todo => !deletedIds.includes(todo.id)));
    setIsLoadingIds(prev => prev.filter(id => !completedIds.includes(id)));
    inputRef.current?.focus();
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
          />

          <Form inputRef={inputRef} onSubmitted={handleSubmit} />
        </header>

        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => {
                return (
                  <div
                    key={todo.id}
                    data-cy="Todo"
                    className={cn('todo', { completed: todo.completed })}
                  >
                    <label className="todo__status-label">
                      <input
                        data-cy="TodoStatus"
                        type="checkbox"
                        className="todo__status"
                        checked={todo.completed}
                        onChange={() => {}}
                      />
                    </label>

                    <span data-cy="TodoTitle" className="todo__title">
                      {todo.title}
                    </span>

                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                      onClick={() => handleDelete(todo.id)}
                    >
                      ×
                    </button>

                    <div
                      data-cy="TodoLoader"
                      className={cn('modal overlay', {
                        'is-active': isLoadingIds.includes(todo.id),
                      })}
                    >
                      {/* eslint-disable-next-line max-len */}
                      <div className="modal-background has-background-white-ter" />
                      <div className="loader" />
                    </div>
                  </div>
                );
              })}
              {tempTodo && (
                <div data-cy="Todo" className="todo">
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>

                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    {/* eslint-disable-next-line max-len */}
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              )}
              {/* This todo is an active todo */}
              {/* <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                Not Completed Todo
              </span>
              <button type="button" className="todo__remove" data-cy="TodoDelete">
                ×
              </button>

              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div> */}

              {/* This todo is being edited */}
              {/* <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              -=-= This form is shown instead of the title and remove button =-=-
              <form>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value="Todo is being edited now"
                />
              </form>

              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div> */}
            </section>
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {todos.filter(todo => !todo.completed).length} items left
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={cn('filter__link', { selected: filter === 'All' })}
                  data-cy="FilterLinkAll"
                  onClick={() => setFilter('All')}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={cn('filter__link', {
                    selected: filter === 'Active',
                  })}
                  data-cy="FilterLinkActive"
                  onClick={() => setFilter('Active')}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={cn('filter__link', {
                    selected: filter === 'Completed',
                  })}
                  data-cy="FilterLinkCompleted"
                  onClick={() => {
                    setFilter('Completed');
                  }}
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={handleClearCompleted}
                disabled={todos.filter(todo => todo.completed).length === 0}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !todosError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setTodosError('')}
        />
        {todosError}
        {/* Unable to update a todo */}
      </div>
    </div>
  );
};
