/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  getTodos, addTodo, deleteTodo, updateTodoCheck,
} from './api/todos';
import { Todo } from './types/Todo';

enum FilterType {
  NONE,
  ACTIVE,
  COMPLETED,
}

enum ErrorType {
  NONE,
  LOAD,
  ADD,
  DELETE,
  UPDATE,
}

const filter = (type: FilterType, todos: Todo[]) => {
  if (type === FilterType.ACTIVE) {
    return todos.filter((todo) => !todo.completed);
  }

  if (type === FilterType.COMPLETED) {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
};

const USER_ID = 10378;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.NONE);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.NONE);
  const [todoLoadId] = useState<number | null>(null);

  const [editableTodoId, setEditableTodoId] = useState<number | null>(null);
  // const [inputValue, setInputValue] = useState('');
  const filteredTodos = filter(filterType, todos);

  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    getTodos(USER_ID)
      .then(res => setTodos(res.slice(0)))
      .catch(() => setErrorType(ErrorType.LOAD));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorType(ErrorType.NONE);
    }, 3000);
  }, [errorType]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          { todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every((todo) => todo.completed),
              })}
            />
          )}

          <form onSubmit={(e) => {
            e.preventDefault();

            addTodo(USER_ID, newTodoTitle)
              .then((newTodo) => {
                setTodos([...todos, newTodo]);
              })
              .catch(() => setErrorType(ErrorType.ADD))
              .finally(() => {
                setNewTodoTitle('');
              });
          }}
          >
            <input
              name="title"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {filteredTodos.map((todo: Todo) => {
            if (todo.id === editableTodoId) {
              return (
                <>
                  <div className="todo" key={todo.id}>
                    <label className="todo__status-label">
                      <input
                        type="checkbox"
                        className="todo__status"
                      />
                    </label>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                    }}
                    >
                      <input
                        type="text"
                        className="todo__title-field"
                        placeholder="Empty todo will be deleted"
                        defaultValue={todo.title}
                        // onChange={(e) => setInputValue(e.target.value)}
                        onBlur={() => setEditableTodoId(null)}
                      />
                    </form>

                    <div className="modal overlay">
                      <div
                        className="modal-background has-background-white-ter"
                      />
                      <div className="loader" />
                    </div>
                  </div>
                </>
              );
            }

            if (todoLoadId === todo.id) {
              return (
                <div className="todo" key={todo.id}>
                  <label className="todo__status-label">
                    <input type="checkbox" className="todo__status" />
                  </label>

                  <span className="todo__title">{todo.title}</span>
                  <button type="button" className="todo__remove">×</button>

                  <div className="modal overlay is-active">
                    <div
                      className="modal-background has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              );
            }

            return (
              <div
                className={classNames('todo', { completed: todo.completed })}
                key={todo.id}
                onDoubleClick={() => {
                  setEditableTodoId(todo.id);
                }}
              >
                <label className="todo__status-label">
                  <input
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onClick={() => {
                      updateTodoCheck(todo.id, !todo.completed)
                        .then(() => {
                          setTodos(todos.map((currentTodo) => {
                            if (currentTodo.id === todo.id) {
                              return {
                                ...currentTodo,
                                completed: !todo.completed,
                              };
                            }

                            return currentTodo;
                          }));
                        })
                        .catch(() => {
                          setErrorType(ErrorType.UPDATE);
                        });
                    }}
                  />
                </label>
                <span className="todo__title">{todo.title}</span>

                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => {
                    deleteTodo(todo.id)
                      .then(() => {
                        setTodos(todos.filter((item) => todo.id !== item.id));
                      })
                      .catch(() => setErrorType(ErrorType.DELETE));
                  }}
                >
                  ×
                </button>

                <div className="modal overlay">
                  <div
                    className="modal-background has-background-white-ter"
                  />
                  <div className="loader" />
                </div>
              </div>
            );
          })}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos.filter((todo) => !todo.completed).length} items left`}
            </span>

            <nav className="filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filterType === FilterType.NONE,
                })}
                onClick={(e) => {
                  e.preventDefault();
                  setFilterType(FilterType.NONE);
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filterType === FilterType.ACTIVE,
                })}
                onClick={(e) => {
                  e.preventDefault();
                  setFilterType(FilterType.ACTIVE);
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filterType === FilterType.COMPLETED,
                })}
                onClick={(e) => {
                  e.preventDefault();
                  setFilterType(FilterType.COMPLETED);
                }}
              >
                Completed
              </a>
            </nav>

            {todos.some((todo) => todo.completed) && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={() => {
                  todos.map((item) => {
                    if (item.completed) {
                      return (
                        deleteTodo(item.id)
                          .then(() => {
                            setTodos(todos.filter((todo) => !todo.completed));
                          })
                      );
                    }

                    return item;
                  });
                }}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorType },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setErrorType(ErrorType.NONE)}
        />
        {errorType === ErrorType.LOAD && 'Unable to load todos'}
        {errorType === ErrorType.ADD && 'Unable to add a todo'}
        {errorType === ErrorType.DELETE && 'Unable to delete a todo'}
        {errorType === ErrorType.UPDATE && 'Unable to update a todo '}
      </div>
    </div>
  );
};
