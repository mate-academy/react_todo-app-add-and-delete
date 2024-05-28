/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

const USER_ID = 700;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>('');
  const [filter, setFilter] = useState<string>('');
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');

  const completedTodos = todos?.reduce(
    (count, todo) => count + (todo.completed ? 0 : 1),
    0,
  );
  const areAllCompleted =
    todos?.length > 0 && todos?.every(todo => todo.completed);

  // #region get
  useEffect(() => {
    client
      .get<Todo[]>('/todos')
      .then(setTodos)
      .catch(() => setError('get'));
  }, []);

  const getVisibleTodos = (generalTodos: Todo[], generalFilter: string) => {
    let filteredTodos = generalTodos;

    // Apply filter based on status
    if (generalFilter === 'active') {
      filteredTodos = filteredTodos.filter(todo => !todo.completed);
    } else if (generalFilter === 'completed') {
      filteredTodos = filteredTodos.filter(todo => todo.completed);
    }

    return filteredTodos;
  };

  const visibleTodos = useMemo(() => {
    return getVisibleTodos(todos, filter);
  }, [todos, filter]);

  // #endregion

  const handleErrorClose = () => {
    setError(null);
  };

  const handleTodoStatusChange = (id: number) => {
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      return;
    }

    const updatedTodoStatus = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    };

    client
      .patch<Todo>(`/todos/${id}`, updatedTodoStatus)
      .then(updated => {
        setTodos(todos.map(todo => (todo.id === id ? updated : todo)));
      })
      .catch(() => setError('Unable to update a todo'));
  };

  //#region delete

  const handleDeleteTodo = (id: number) => {
    client
      .delete(`/todos/${id}`)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => setError('Unable to delete a todo'));
  };

  //#endregion

  //#region input/post
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setError('Title should not be empty');

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    };

    client
      .post<Todo>('/todos', newTodo)
      .then(addedTodo => {
        setTodos([...todos, addedTodo]);
        setNewTodoTitle('');
      })
      .catch(() => setError('Unable to add a todo'));
  };

  //#endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleFilterAll = () => {
    setFilter('');
  };

  const handleFilterActive = () => {
    setFilter('active');
  };

  const handleFilterCompleted = () => {
    setFilter('completed');
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={`todoapp__toggle-all ${areAllCompleted ? 'active' : ''}`}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={handleInputChange}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos?.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''}`}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked
                  onChange={() => handleTodoStatusChange(todo.id)}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {completedTodos} items left
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={`filter__link ${filter === '' ? 'selected' : ''}`}
              data-cy="FilterLinkAll"
              onClick={handleFilterAll}
            >
              All
            </a>

            <a
              href="#/active"
              className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
              data-cy="FilterLinkActive"
              onClick={handleFilterActive}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
              data-cy="FilterLinkCompleted"
              onClick={handleFilterCompleted}
            >
              Completed
            </a>
          </nav>

          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
          >
            Clear completed
          </button>
        </footer>
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleErrorClose}
        />
        {/* show only one message at a time */}
        {error === 'Title should not be empty' && (
          <p>Title should not be empty</p>
        )}
        {error === 'Unable to add a todo' && <p>Unable to add a todo</p>}
        {error === 'Unable to delete a todo' && <p>Unable to delete a todo</p>}
        {error === 'Unable to update a todo' && <p>Unable to update a todo</p>}
        {error === 'get' && <p>Unable to retrieve todos</p>}
      </div>
    </div>
  );
};
