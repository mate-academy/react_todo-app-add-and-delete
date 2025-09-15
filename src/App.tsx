/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';

import { useToChangeTheTodo as toChangeTheTodo } from './components/toChangeTheTodo';
import { handleUpdateTodo } from './components/handleUpdateTodo';
import { handleToggle } from './components/handleToggle';
import { handleToggleAll } from './components/handleToggleAll';
import { handleAddTodo } from './components/handleAddTodo';
import { deleteTodo } from './components/deleteTodo';
import { handleDelete } from './components/handleDelete';
import { useFilteredTodos } from './components/filteredTodos';
import { useTrackAmountChange } from './components/trackAmountChange';
import { useRequestToInsert } from './components/requestToInsert';

const USER_ID = 3381;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(false);
  /* eslint-disable */
  const [errorType, setErrorType] = useState<
    null | 'load' | 'update' | 'add' | 'delete' | 'empty'
  >(null);
  /* eslint-enable */
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [changeQuantity, setChangeQuantity] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editledTitle, setEditledTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [creatingId, setCreatingId] = useState<number | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useRequestToInsert({ setTodos, setError, setErrorType });
  const filteredTodos = useFilteredTodos({ todos, filter });

  useTrackAmountChange({ setChangeQuantity, todos, creatingId });
  toChangeTheTodo({ error, setError });

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
            className={`todoapp__toggle-all ${todos.length > 0 && todos.every(todo => todo.completed) ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            onClick={() =>
              handleToggleAll({
                todos,
                setProcessingIds,
                setTodos,
                setError,
                setErrorType,
              })
            }
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={event =>
              handleAddTodo({
                event,
                newTodo,
                setError,
                setErrorType,
                setTodos,
                setCreatingId,
                setIsSubmitting,
                setNewTodo,
                inputRef,
              })
            }
          >
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              disabled={isSubmitting}
              autoFocus
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''}`}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
                <input
                  id={`todo-${todo.id}`}
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() =>
                    handleToggle({
                      todo,
                      setProcessingIds,
                      setTodos,
                      setError,
                      setErrorType,
                    })
                  }
                />
              </label>

              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setEditingId(todo.id);
                  setEditledTitle(todo.title);
                }}
              >
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editledTitle}
                    autoFocus
                    onChange={e => setEditledTitle(e.target.value)}
                    onBlur={() =>
                      handleUpdateTodo({
                        todo,
                        newTitle: editledTitle,
                        deleteTodo,
                        setTodos,
                        setEditingId,
                        setEditledTitle,
                        setError,
                        setErrorType,
                      })
                    }
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleUpdateTodo({
                          todo,
                          newTitle: editledTitle,
                          deleteTodo,
                          setTodos,
                          setEditingId,
                          setEditledTitle,
                          setError,
                          setErrorType,
                        });
                      }

                      if (e.key === 'Escape') {
                        setEditingId(null);
                        setEditledTitle('');
                      }
                    }}
                  />
                ) : (
                  todo.title
                )}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() =>
                  deleteTodo({
                    todoId: todo.id,
                    todos,
                    setProcessingIds,
                    setTodos,
                    setError,
                    setErrorType,
                    inputRef,
                  })
                }
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={`modal overlay ${
                  processingIds.includes(todo.id) || creatingId === todo.id
                    ? 'is-active'
                    : 'hidden'
                }`}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${changeQuantity} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={filteredTodos.every(todo => !todo.completed)}
              onClick={() =>
                handleDelete({
                  list: filteredTodos,
                  setProcessingIds,
                  setTodos,
                  setError,
                  setErrorType,
                  inputRef,
                })
              }
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
        className={`notification is-danger is-light has-text-weight-normal ${!error ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(false)}
        />
        {/* show only one message at a time */}
        {errorType === 'load' && (
          <>
            <br />
            Unable to load todos
          </>
        )}

        {errorType === 'empty' && (
          <>
            <br />
            Title should not be empty
          </>
        )}

        {errorType === 'add' && (
          <>
            <br />
            Unable to add a todo
          </>
        )}

        {errorType === 'delete' && (
          <>
            <br />
            Unable to delete a todo
          </>
        )}

        {errorType === 'update' && (
          <>
            <br />
            Unable to update a todo
          </>
        )}
      </div>
    </div>
  );
};
