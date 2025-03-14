/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  USER_ID,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

enum FilterName {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}
type OptionUpdate = 'all' | 'once';

export const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todo, setTodo] = useState<string>('');

  const [waiterLoading, setWaiterLoading] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [activeFilter, setActiveFilter] = useState<FilterName>(FilterName.All);

  const showError = (text: string) => {
    setErrorMsg(text);
    const timerId = window.setTimeout(() => {
      window.clearTimeout(timerId);
      setErrorMsg('');
    }, 3000);
  };

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(allTodos => {
        setTodos(allTodos);
      })
      .catch(() => showError('Unable to load todos'))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, errorMsg]);

  const onFilteredTodos = (filterName: FilterName): Todo[] => {
    switch (filterName) {
      case FilterName.All:
        return todos;
      case FilterName.Active:
        return todos.filter(todoItem => !todoItem.completed);
      case FilterName.Completed:
        return todos.filter(todoItem => !!todoItem.completed);
      default:
        return todos;
    }
  };

  const createNewTodo = (title: string): Todo => {
    return {
      completed: false,
      id: 0,
      title: title,
      userId: USER_ID,
    };
  };

  const filteredTodos = onFilteredTodos(activeFilter);
  const activeTodos = onFilteredTodos(FilterName.Active);
  const completedTodos = onFilteredTodos(FilterName.Completed);

  const handleCloseErrorButton = () => {
    setErrorMsg('');
  };

  const createTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!todo.trim()) {
      showError('Title should not be empty');

      return;
    }

    const newTempTodo = createNewTodo(todo.trim());

    setTempTodo(newTempTodo);
    setLoading(true);

    addTodo(newTempTodo)
      .then(newTodo => {
        setTodos(prev => {
          return [...prev, newTodo];
        });
        setTempTodo(null);
        setTodo('');
      })
      .catch(() => {
        showError('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => setLoading(false));
  };

  const removeTodo = (id: number) => {
    setWaiterLoading(id);
    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.filter(todoItem => todoItem.id !== id);
        });
      })
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => {
        setWaiterLoading(null);
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    setTodo(event.target.value);
  };

  const updateChecked = (
    updatedTodo: Todo,
    option: OptionUpdate = 'once',
  ): void => {
    let updateCompleted = !updatedTodo.completed;

    if (option === 'all') {
      updateCompleted = true;
    }

    setWaiterLoading(updatedTodo.id);
    updateTodo({ ...updatedTodo, completed: updateCompleted })
      .then(todoItem => {
        setTodos(currentTodos => {
          const newPosts = [...currentTodos];
          const index = newPosts.findIndex(
            todoIndex => todoIndex.id === updatedTodo.id,
          );

          newPosts.splice(index, 1, todoItem);

          return newPosts;
        });
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => {
        setWaiterLoading(null);
      });
  };

  const toggleAllTodos = (): void => {
    const isCompletedAllTodos = todos.some(item => item.completed === false);

    if (isCompletedAllTodos) {
      todos.map(todoItem => {
        updateChecked(todoItem, 'all');
      });

      return;
    }

    todos.map(todoItem => {
      updateChecked(todoItem, 'once');
    });
  };

  const clearCompleted = (todosCompleted: Todo[]): void => {
    todosCompleted.forEach(itemTodo => {
      removeTodo(itemTodo.id);
    });
  };

  return (
    <>
      {!USER_ID ? (
        <UserWarning />
      ) : (
        <div className="todoapp">
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            <header className="todoapp__header">
              {/* this button should have `active` class only if all todos are completed */}
              {todos.length > 0 && (
                <button
                  type="button"
                  className="todoapp__toggle-all active"
                  data-cy="ToggleAllButton"
                  onClick={toggleAllTodos}
                />
              )}

              {/* Add a todo on form submit */}
              <form onSubmit={createTodo} onReset={() => setTodo('')}>
                <input
                  ref={inputRef}
                  data-cy="NewTodoField"
                  type="text"
                  value={todo}
                  className="todoapp__new-todo"
                  placeholder="What needs to be done?"
                  onChange={handleChange}
                  disabled={loading}
                />
              </form>
            </header>

            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos?.map(todoItem => (
                <div
                  data-cy="Todo"
                  className={classNames('todo', {
                    completed: todoItem.completed,
                  })}
                  key={todoItem.id}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      onChange={() => {
                        updateChecked(todoItem);
                      }}
                      checked={todoItem.completed}
                      // onDoubleClick={() => updateTodo(todo)}
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {todoItem.title}
                  </span>

                  {/* Remove button appears only on hover */}
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => removeTodo(todoItem.id)}
                  >
                    ×
                  </button>

                  {/* overlay will cover the todo while it is being deleted or updated */}

                  <div
                    data-cy="TodoLoader"
                    className={classNames('modal overlay', {
                      'is-active': waiterLoading === todoItem.id,
                    })}
                  >
                    <div
                      className="modal-background
                    has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              ))}

              {/* This todo is being edited */}
              {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label> */}

              {/* This form is shown instead of the title and remove button */}
              {/* <form>
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

              {/* This todo is in loadind state */}
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

                  {/* 'is-active' class puts this modal on top of the todo */}
                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    <div
                      className="modal-background
                     has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              )}
            </section>

            {/* Hide the footer if there are no todos */}

            {todos?.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {activeTodos.length} items left
                </span>

                {/* Active link should have the 'selected' class */}
                <nav className="filter" data-cy="Filter">
                  <a
                    href="#/"
                    className={classNames('filter__link', {
                      selected: activeFilter === FilterName.All,
                    })}
                    data-cy="FilterLinkAll"
                    onClick={() => setActiveFilter(FilterName.All)}
                  >
                    All
                  </a>

                  <a
                    href="#/active"
                    className={classNames('filter__link', {
                      selected: activeFilter === FilterName.Active,
                    })}
                    data-cy="FilterLinkActive"
                    onClick={() => setActiveFilter(FilterName.Active)}
                  >
                    Active
                  </a>

                  <a
                    href="#/completed"
                    className={classNames('filter__link', {
                      selected: activeFilter === FilterName.Completed,
                    })}
                    data-cy="FilterLinkCompleted"
                    onClick={() => setActiveFilter(FilterName.Completed)}
                  >
                    Completed
                  </a>
                </nav>

                {/* this button should be disabled if there are no completed todos */}

                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  onClick={() => clearCompleted(completedTodos)}
                  disabled={completedTodos.length < 1}
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
            className={classNames(
              'notification is-danger is-light has-text-weight-normal',
              { hidden: !errorMsg },
            )}
          >
            <button
              data-cy="HideErrorButton"
              type="button"
              className="delete"
              onClick={handleCloseErrorButton}
            />
            {errorMsg}

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
          </div>
        </div>
      )}
    </>
  );
};
