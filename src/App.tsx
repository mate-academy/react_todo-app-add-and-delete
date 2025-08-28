/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

enum FilterQuery {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

enum ErrorMassage {
  Load = 'Unable to load todos',
  Empty = 'Title should not be empty',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);

  const [errorMassage, setErrorMassage] = useState('');

  const [query, setQuery] = useState(FilterQuery.All);

  const [title, setTitle] = useState('');

  const [disableInput, setDisableInput] = useState(false);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const [todoToDelete, setTodoToDelete] = useState<number[]>([]);

  useEffect(() => {
    if (errorMassage) {
      const timer = setTimeout(() => {
        setErrorMassage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMassage]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todos = await getTodos();

        setVisibleTodos(todos);
      } catch (e) {
        setErrorMassage(ErrorMassage.Load);
      }
    };

    loadTodos();
  }, []);

  const addTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMassage(ErrorMassage.Empty);

      return;
    }

    const newTodo = {
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    try {
      setDisableInput(true);
      const addedTodo = await addTodos(newTodo);

      setVisibleTodos(prev => [...prev, addedTodo]);

      setTitle('');
    } catch (e) {
      setVisibleTodos(prev => prev.filter(todo => todo.id !== 0));
      setErrorMassage(ErrorMassage.Add);
    } finally {
      setDisableInput(false);

      setTempTodo(null);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const getFilteredTodos = (
  todosToFilter: Todo[],
  queryToFilter: FilterQuery,
): Todo[] => {
  switch (queryToFilter) {
    case FilterQuery.Active:
      return todosToFilter.filter(todo => !todo.completed);

    case FilterQuery.Completed:
      return todosToFilter.filter(todo => todo.completed);

    case FilterQuery.All:
    default:
      return todosToFilter;
  }
};

  const deleteTodo = async (todoId: number) => {
    setTodoToDelete(prev => [...prev, todoId]);

    try {
      await deleteTodos(todoId);
      setVisibleTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMassage(ErrorMassage.Delete);
    } finally {
      setTodoToDelete(prev => prev.filter(id => id !== todoId));

      inputRef.current?.focus();
    }
  };

  const clearCompleted = async () => {
    const completedTodos = visibleTodos.filter(todo => todo.completed);
    const needDelete = completedTodos.map(todo => todo.id);

    if (needDelete.length === 0) {
      return;
    }

    setTodoToDelete(prev => [...prev, ...needDelete]);

    try {
      const deleted = await Promise.allSettled(
        completedTodos.map(todo => deleteTodos(todo.id)),
      );

      const deleteComplited = completedTodos
        .filter((todo, index) => deleted[index].status === 'fulfilled')
        .map(todo => todo.id);

      if (deleted.some(result => result.status === 'rejected')) {
        setErrorMassage(ErrorMassage.Delete);
      }

      if (deleteComplited.length > 0) {
        setVisibleTodos(prev =>
          prev.filter(todo => !deleteComplited.includes(todo.id)),
        );
      }
    } catch (error) {
      setErrorMassage(ErrorMassage.Delete);
    } finally {
      setTodoToDelete(prev => prev.filter(id => !needDelete.includes(id)));

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const todosForRender = tempTodo ? [...visibleTodos, tempTodo] : visibleTodos;
  const filteredTodos = getFilteredTodos(todosForRender, query);
  const itemsLeft = visibleTodos.filter(todo => todo.completed === false);

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
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={addTodo}>
            <input
              ref={inputRef}
              value={title}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              onChange={event => setTitle(event.target.value)}
              disabled={disableInput}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <div
              data-cy="Todo"
              className={classNames('todo', { completed: todo.completed })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodo(todo.id)}
                disabled={todoToDelete.includes(todo.id) || todo.id === 0}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': todoToDelete.includes(todo.id) || todo.id === 0,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {visibleTodos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {itemsLeft.length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: query === 'All',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setQuery(FilterQuery.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: query === 'Active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setQuery(FilterQuery.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: query === 'Completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setQuery(FilterQuery.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={clearCompleted}
              disabled={!visibleTodos.find(todo => todo.completed === true)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMassage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMassage('')}
        />
        {errorMassage}
      </div>
    </div>
  );
};
