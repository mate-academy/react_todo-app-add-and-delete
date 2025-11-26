/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoContext } from './context/TodoContext';
import { ERROR_TYPE, FILTER_TYPE } from './consts/constants';

export const App: React.FC = () => {
  const {
    todos,
    todoTitle,
    filteredTodos,
    filterBy,
    setFilterBy,
    loadingIds,
    error,
    editingId,
    setEditingId,
    unfinishedTodos,
    editTodoTitle,
    setEditTodoTitle,
    inputRef,
    tempTodo,
    handleEditingTodo,
    handleTitleChange,
    handleToggleAll,
    handleEditFormSubmission,
    handleDeleteTodo,
    handleCloseError,
    handleTodoToggle,
    handleClearCompleted,
    handleSubmitNewTodo,
  } = React.useContext(TodoContext);

  const hasCompletedTodo = todos.some(todo => todo.completed);

  const allTodosCompleted = todos.every(todo => todo.completed);

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
            onClick={() => handleToggleAll(todos)}
            className={`todoapp__toggle-all ${allTodosCompleted && 'active'}`}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmitNewTodo}>
            <input
              data-cy="NewTodoField"
              ref={inputRef}
              type="text"
              value={todoTitle}
              onChange={handleTitleChange}
              className="todoapp__new-todo"
              disabled={loadingIds.length > 0}
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              onDoubleClick={() => {
                setEditingId(todo.id);
                setEditTodoTitle(todo.title);
              }}
              className={`todo ${todo.completed ? 'completed' : ''}`}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  onChange={() => handleTodoToggle(todo)}
                  checked={todo.completed}
                />
              </label>

              {editingId === todo.id ? (
                <form
                  onSubmit={event => {
                    event.preventDefault();
                    handleEditFormSubmission(todo);
                  }}
                >
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    onBlur={() => handleEditFormSubmission(todo)}
                    className="todo__title-field"
                    onKeyUp={event => {
                      if (event.key === 'Escape') {
                        setEditingId(null);
                        setEditTodoTitle(todo.title);
                      }
                    }}
                    onChange={event => handleEditingTodo(event)}
                    value={editTodoTitle}
                    placeholder="Empty todo will be deleted"
                  />
                </form>
              ) : (
                <>
                  <span data-cy="TodoTitle" className="todo__title">
                    {todo.title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    onClick={() => handleDeleteTodo(todo.id)}
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>
                </>
              )}

              {/* overlay will cover the todo while it is being deleted or updated */}
              {/* {fix is loading logic rn it sets the loader on all todos, even already loaded} */}
              <div
                data-cy="TodoLoader"
                className={`modal overlay ${loadingIds.includes(todo.id) ? 'is-active' : ''}`}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {tempTodo && (
            <div
              key={tempTodo.id}
              data-cy="Todo"
              className={`todo ${tempTodo.completed ? 'completed' : ''}`}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
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

              {/* overlay will cover the todo while it is being deleted or updated */}
              {/* {fix is loading logic rn it sets the loader on all todos, even already loaded} */}
              <div
                data-cy="TodoLoader"
                className={`modal overlay ${loadingIds.includes(tempTodo.id) ? 'is-active' : ''}`}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${unfinishedTodos.length} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                onClick={() => {
                  setFilterBy(FILTER_TYPE.ALL);
                }}
                className={`filter__link ${filterBy === FILTER_TYPE.ALL ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filterBy === FILTER_TYPE.ACTIVE ? 'selected' : ''}`}
                onClick={() => {
                  setFilterBy(FILTER_TYPE.ACTIVE);
                }}
                data-cy="FilterLinkActive"
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filterBy === FILTER_TYPE.COMPLETED ? 'selected' : ''}`}
                onClick={() => {
                  setFilterBy(FILTER_TYPE.COMPLETED);
                }}
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={() => handleClearCompleted(todos)}
              disabled={!hasCompletedTodo}
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
        className={`notification is-danger ${error === ERROR_TYPE.NONE ? 'hidden' : ''} is-light has-text-weight-normal`}
      >
        <button
          data-cy="HideErrorButton"
          onClick={handleCloseError}
          type="button"
          className="delete"
        />
        {/* show only one message at a time */}
        {error === ERROR_TYPE.LOAD && `Unable to load todos`}
        {error === ERROR_TYPE.TITLE && `Title should not be empty`}
        {error === ERROR_TYPE.ADD && `Unable to add a todo`}
        {error === ERROR_TYPE.DELETE && `Unable to delete a todo`}
        {error === ERROR_TYPE.UPDATE && `Unable to update a todo`}
        <br />
      </div>
    </div>
  );
};
