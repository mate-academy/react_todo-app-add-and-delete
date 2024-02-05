/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import cn from 'classnames';
import { TodoContext } from './TodoContext';
import { Todo } from './types/Todo';

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
    existingCompleted,
    titleField,
    tempTodo,
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
  } = useContext(TodoContext);

  const onSubmitMainInput = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisableInput(true);
    handleSubmit();
    if (!postTodo.trim()) {
      setError('Title should not be empty');
    }
  };

  const onSubmitRenameField = (
    event: React.FormEvent<HTMLFormElement>,
    value: Todo,
  ) => {
    event.preventDefault();
    makeTodoChange(value.id, editingTodo.trim());
    setIsChosenToRename(0);
    if (!editingTodo.trim()) {
      setError('Title should not be empty');
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

          <form onSubmit={onSubmitMainInput}>
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
          {filteredTodos.map((todo) => (
            <React.Fragment key={todo.id}>
              {isChosenToRename === todo.id ? (
                <div data-cy="Todo" className="todo">
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                    />
                  </label>
                  <form onSubmit={event => onSubmitRenameField(event, todo)}>
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
                    completed: todo.completed,
                  })}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      onChange={() => null}
                      onClick={() => {
                        makeTodoCompleted(todo.id, todo.completed);
                      }}
                    />
                  </label>

                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      handleEditing(todo.id);
                      setEditingTodo(todo.title);
                    }}
                    onKeyUp={(event) => {
                      if (event.key === 'Enter') {
                        handleEditing(todo.id);
                      }
                    }}
                  >
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => {
                      handleDelete(todo.id);
                    }}
                  >
                    ×
                  </button>

                  <div
                    data-cy="TodoLoader"
                    className={cn('modal overlay', {
                      'is-active': isLoading.includes(todo.id),
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
        </section>

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

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${nonCompletedTodos} items left`}
            </span>

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
            Title should not be empty
          </>
        )}
        {error === 'Unable to add a todo' && (
          <>
            Unable to add a todo
          </>
        )}
        {error === 'Unable to delete a todo' && (
          <>
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
