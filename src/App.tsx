/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState, useRef, useEffect, FormEvent } from 'react';
import classNames from 'classnames';
import * as todosServise from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { SelectedBy } from './types/SelectedBy';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedBy, setSelectedBy] = useState<SelectedBy>(SelectedBy.all);
  const [errorMessage, setErrorMessage] = useState('');
  const field = useRef<HTMLInputElement>(null);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabletField, setIsDisabletField] = useState(false);
  const [title, setTilte] = useState('');

  useEffect(() => {
    field.current?.focus();
  }, [todos, tempTodo]);

  const loadingTodos = () => {
    todosServise
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  useEffect(() => {
    loadingTodos();
  }, []);

  if (!todosServise.USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo =>
    selectedBy === SelectedBy.completed ? todo.completed : !todo.completed,
  );

  function createTodo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setTempTodo({
      id: 0,
      title,
      userId: todosServise.USER_ID,
      completed: false,
    });

    setIsDisabletField(true);

    todosServise
      .createTodos({
        title: title.trim(),
        userId: todosServise.USER_ID,
        completed: false,
      })
      .then(result => {
        todos.push(result);
        setTilte('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsDisabletField(false);
        setTempTodo(null);
      });
  }

  function deleteTodo(deletedId: number, deletedTodo?: Todo) {
    if (deletedTodo) {
      setTempTodo(deletedTodo);
    }

    todosServise
      .deleteTodo(deletedId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== deletedId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => setTempTodo(null));
  }

  function clearComplitedTodos(arrIds: number[]) {
    arrIds.forEach(id => {
      deleteTodo(id);
    });
  }

  const activeTodosLength = todos.reduce((sum: number, currTodo: Todo) => {
    return currTodo.completed ? sum : sum + 1;
  }, 0);

  const complitedTodosIds = todos.reduce((result: number[], curTodo: Todo) => {
    if (curTodo.completed) {
      result.push(curTodo.id);
    }

    return result;
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={createTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={field}
              value={title}
              onChange={e => setTilte(e.target.value)}
              disabled={isDisabletField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {(selectedBy === SelectedBy.all ? todos : filteredTodos).map(
                todo => (
                  <div
                    data-cy="Todo"
                    key={todo.id}
                    className={classNames('todo', {
                      completed: todo.completed,
                    })}
                  >
                    <label className="todo__status-label">
                      <input
                        data-cy="TodoStatus"
                        type="checkbox"
                        className="todo__status"
                        checked={todo.completed}
                      />
                    </label>

                    {tempTodo?.id === todo.id ? (
                      <form>
                        <input
                          data-cy="TodoTitleField"
                          type="text"
                          name="newTitle"
                          className="todo__title-field"
                          placeholder="Empty todo will be deleted"
                          autoFocus
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
                          data-cy="TodoDelete"
                          onClick={() => deleteTodo(todo.id, todo)}
                        >
                          ×
                        </button>
                      </>
                    )}

                    <div
                      data-cy="TodoLoader"
                      className={classNames('modal overlay', {
                        'is-active': tempTodo?.id === todo.id,
                      })}
                    >
                      <div
                        className="
                      modal-background
                      has-background-white-ter
                    "
                      />
                      <div className="loader" />
                    </div>
                  </div>
                ),
              )}
              {tempTodo?.id === 0 && (
                <div
                  data-cy="Todo"
                  key={tempTodo.id}
                  className={classNames('todo', {
                    completed: tempTodo.completed,
                  })}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      defaultChecked={tempTodo.completed}
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => deleteTodo(tempTodo.id)}
                  >
                    ×
                  </button>
                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              )}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeTodosLength} items left
              </span>

              <nav className="filter" data-cy="Filter">
                {Object.values(SelectedBy).map(value => (
                  <a
                    key={value}
                    href={`#/${value}`}
                    className={classNames('filter__link', {
                      selected: selectedBy === value,
                    })}
                    onClick={() => setSelectedBy(value)}
                    data-cy={`FilterLink${value}`}
                  >
                    {value}
                  </a>
                ))}
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={activeTodosLength === todos.length}
                onClick={() => clearComplitedTodos(complitedTodosIds)}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
