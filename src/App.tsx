/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';

type PartialTodo = Omit<Todo, 'id'>;

const USER_ID = 11880;

enum FilterBy {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

const filterTodos = (todos: Todo[], filter: FilterBy): Todo[] => {
  switch (filter) {
    case FilterBy.All:
      return todos;
    case FilterBy.Active:
      return todos.filter(todo => !todo.completed);
    case FilterBy.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isBlured, setIsBlured] = useState<number | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const newTimeout = 3000;

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(e.target.value);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((usersFromServer) => {
        setAllTodos((prevAllTodos) => [...prevAllTodos, ...usersFromServer]);
      })
      .catch(() => {
        setError('Unable to load todos');

        setTimeout(() => {
          setError('');
        }, newTimeout);
      });
  }, []);

  const todoData: PartialTodo = {
    userId: USER_ID,
    completed: false,
    title: newTodoTitle,
  };

  const onSubmit = (e: React.FormEvent) => {
    setError('');
    setIsDisabled(true);
    e.preventDefault();
    todoData.title = newTodoTitle;

    if (todoData.title.trim() === '') {
      setError('Title should not be empty');

      todoData.title = '';
      setTimeout(() => {
        setError('');
      }, 3000);

      setIsDisabled(false);

      return;
    }

    setTempTodo({
      completed: false,
      title: newTodoTitle.trim(),
      id: 0,
      userId: USER_ID,
    });

    addTodo({
      userId: USER_ID,
      completed: false,
      title: newTodoTitle.trim(),
    })
      .then((data) => {
        setNewTodoTitle('');
        setAllTodos([...allTodos, data]);
      })
      .catch(() => {
        setError('Unable to add a todo');

        setTimeout(() => {
          setError('');
        }, newTimeout);

        setTempTodo(null);
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
      });
  };

  const onDelete = (postId: number) => {
    setIsBlured(postId);

    deleteTodo(postId)
      .then(() => {
        setAllTodos(allTodos.filter(todo => todo.id !== postId));
      })
      .finally(() => {
        setIsBlured(null);
      });
  };

  useEffect(() => {
    setFilteredTodos(filterTodos(allTodos, filterBy));
  }, [filterBy, allTodos]);

  const handleFilterClick = (filterType: FilterBy) => (
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    setFilterBy(filterType);
  };

  const completedTodos = [...allTodos].filter(todo => todo.completed);
  const activeTodos = [...allTodos].filter(todo => !todo.completed);

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
          <form onSubmit={onSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={handleTitleChange}
              ref={inputRef}
              disabled={isDisabled}
            />
          </form>
        </header>

        <section
          className="todoapp__main"
          data-cy="TodoList"
        >
          {filteredTodos.map(todo => {
            return (
              <div
                key={todo.id}
                data-cy="Todo"
                className={classNames('todo', { completed: todo.completed })}
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
                  onClick={() => onDelete(todo.id)}
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={classNames('modal overlay',
                    { 'is-active': isBlured === todo.id })}
                >
                  <div className="modal-background
                    has-background-white-ter"
                  />
                  <div className="loader" />
                </div>
              </div>
            );
          })}

          {tempTodo && (
            <div
              key={tempTodo.id}
              data-cy="Todo"
              className={classNames('todo', { completed: tempTodo?.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo?.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo?.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => onDelete(tempTodo.id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={`modal overlay ${tempTodo ? 'is-active' : ''}`}
              >
                <div className="modal-background
                    has-background-white-ter"
                />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {allTodos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filterBy === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={handleFilterClick(FilterBy.All)}
              >
                All
              </a>

              <a
                href="#/"
                className={`filter__link ${filterBy === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={handleFilterClick(FilterBy.Active)}
              >
                Active
              </a>

              <a
                href="#/"
                className={`filter__link ${filterBy === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={handleFilterClick(FilterBy.Completed)}
              >
                Completed
              </a>
            </nav>

            {completedTodos.length >= 0 && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
