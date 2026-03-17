/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoList } from './Components/TodoList';
import { Todo } from './types/Todo';
import { FILTERS, FilterType } from './constants/filter';
import { Filter } from './Components/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>(FILTERS.ALL);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDelete = async (id: number) => {
    setDeletingIds(prev => [...prev, id]);
    try {
      await deleteTodo(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Unable to delete a todo');
    } finally {
      setDeletingIds(prev => prev.filter(item => item !== id));

      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = todos.filter(todo => {
    if (filter === FILTERS.ACTIVE) {
      return !todo.completed;
    }

    if (filter === FILTERS.COMPLETED) {
      return todo.completed;
    }

    return true;
  });

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    const loadTodos = async () => {
      setError('');
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (err) {
        setError('Unable to load todos');
      }
    };

    loadTodos();
  }, []);

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
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={async e => {
              e.preventDefault();
              console.log('submit works');

              const trimmedTitle = title.trim();

              if (!trimmedTitle) {
                setError('Title should not be empty');
                return;
              }
              const newTodo: Todo = {
                id: 0,
                title: trimmedTitle,
                completed: false,
                userId: USER_ID,
              };
              setTempTodo(newTodo);
              setIsLoading(true);

              try {
                const savedTodos = await addTodo({
                  title: trimmedTitle,
                  completed: false,
                  userId: USER_ID,
                });

                setTodos(prev => [...prev, savedTodos]);
                setTitle('');
              } catch (err) {
                setError('Unable to add a todo');
              } finally {
                setTempTodo(null);
                setIsLoading(false);
                // inputRef.current?.focus();
              }
            }}
          >
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {/* This is a completed todo */}
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={handleDelete}
              deletingIds={deletingIds}
            />
          </section>
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos.length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <Filter filter={filter} setFilter={setFilter} />

            {/* this button should be disabled if there are no completed todos */}
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

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`
          notification is-danger is-light has-text-weight-normal
          ${error ? '' : 'hidden'}
          `}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {/* show only one message at a time */}
        {/* Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
        {error}
      </div>
    </div>
  );
};
