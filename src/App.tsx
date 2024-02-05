/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import cn from 'classnames';
import { TodoContext } from './TodoContext';

export const App: React.FC = () => {
  const {
    todos,
    filteredTodos,
    filter,
    error,
    nonCompletedTodos,
    postTodo,
    disableInput,
    isLoading,
    isChosenToRename,
    editingTodo,
    setIsChosenToRename,
    setEditingTodo,
    setDisableInput,
    setFilter,
    handleSubmit,
    setError,
    setPostTodo,
    handleDelete,
    handleCompletedDelete,
    makeTodoCompleted,
    handleEditing,
    makeTodoChange,
    existingCompleted,
    titleField,
    tempTodo,
  } = useContext(TodoContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={(event) => {
            event.preventDefault();
            setDisableInput(true);
            handleSubmit();
            if (!postTodo.trim()) {
              setError('Title should not be empty');
            }
          }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={titleField as React.RefObject<HTMLInputElement>}
              disabled={disableInput}
              value={postTodo}
              onChange={(event) => {
                setPostTodo(event.target.value);
              }}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map((value) => (
            <React.Fragment key={value.id}>
              {isChosenToRename === value.id ? (
                <div data-cy="Todo" className="todo">
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                    />
                  </label>
                  <form onSubmit={(event) => {
                    event.preventDefault();
                    makeTodoChange(value.id, editingTodo.trim());
                    setIsChosenToRename(0);
                    if (!editingTodo.trim()) {
                      setError('Title should not be empty');
                    }
                  }}
                  >
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={editingTodo}
                      onChange={(event) => {
                        setEditingTodo(event.target.value);
                      }}
                    />
                  </form>

                  <div data-cy="TodoLoader" className="modal overlay">
                    <div
                      className="modal-background has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              ) : (
                <div
                  data-cy="Todo"
                  className={cn('todo', {
                    completed: value.completed,
                  })}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={value.completed}
                      onChange={() => null}
                      onClick={() => {
                        makeTodoCompleted(value.id, value.completed);
                      }}
                    />
                  </label>

                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      handleEditing(value.id);
                      setEditingTodo(value.title);
                    }}
                    onKeyUp={(event) => {
                      if (event.key === 'Enter') {
                        handleEditing(value.id);
                      }
                    }}
                  >
                    {value.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => {
                      handleDelete(value.id);
                    }}
                  >
                    ×
                  </button>

                  <div
                    data-cy="TodoLoader"
                    className={cn('modal overlay', {
                      'is-active': isLoading.includes(value.id),
                    })}
                  >
                    <div
                      className="modal-background has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              )}

            </React.Fragment>
          ))}

          {tempTodo && (
            <div key={tempTodo.id} data-cy="Todo" className="todo temp-todo">
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
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}

          {/* This todo is not completed */}
          {/* {<div data-cy="Todo" className="todo">
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
          </div>} */}

          {/* This todo is being edited */}
          {/* {<div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            This form is shown instead of the title and remove button
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
          </div>} */}

          {/* This todo is in loadind state */}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${nonCompletedTodos} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: filter === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => {
                  setFilter('all');
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filter === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => {
                  setFilter('active');
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => {
                  setFilter('completed');
                }}
              >
                Completed
              </a>
            </nav>

            {/* don't show this button if there are no completed todos */}
            {existingCompleted && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={() => {
                  handleCompletedDelete();
                }}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      {/* show only one message at a time */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal', {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setError('');
          }}
        />
        {error === 'Unable to load todos' && (
          'Unable to load todos'
        )}
        {error === 'Title should not be empty' && (
          <>
            {/* {<br />} */}
            Title should not be empty
          </>
        )}
        {error === 'Unable to add a todo' && (
          <>
            {/* {<br />} */}
            Unable to add a todo
          </>
        )}
        {error === 'Unable to delete a todo' && (
          <>
            {/* {<br />} */}
            Unable to delete a todo
          </>
        )}
        {/* {<br />
          <br />
          Unable to update a todo} */}
      </div>
    </div>
  );
};
